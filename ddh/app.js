/* DDH Doctor Scheduler — vanilla JS, no dependencies.
 * All data lives in localStorage under STORAGE_KEY.
 */
(() => {
  "use strict";

  const STORAGE_KEY = "ddh-scheduler-v1";

  // requiredYear restricts who may staff the room (null = any year).
  // Every room holds one doctor per duty group so someone is on Duty daily.
  const ROOMS = [
    { id: "er",  label: "ER",      sub: "All of Floor 1 · Special", special: true,  requiredYear: 2 },
    { id: "icu", label: "ICU",     sub: "Floor 2 · Special room",   special: true,  requiredYear: 3 },
    { id: "f2",  label: "Floor 2", sub: "General rooms",            special: false, requiredYear: null },
    { id: "f3",  label: "Floor 3", sub: "General rooms",            special: false, requiredYear: null },
    { id: "f4",  label: "Floor 4", sub: "General rooms",            special: false, requiredYear: null },
    { id: "f5",  label: "Floor 5", sub: "General rooms",            special: false, requiredYear: null },
  ];

  const GROUPS = ["A", "B", "C"];
  // Status cycle: a group is on Duty, then Post-duty the next day, then Pre-duty.
  const STATUSES = ["Duty", "Post-duty", "Pre-duty"];
  const STATUS_CLASS = { "Duty": "duty", "Post-duty": "post-duty", "Pre-duty": "pre-duty" };

  const YEAR_LABEL = { 1: "1st year", 2: "2nd year", 3: "3rd year" };

  // Dummy roster loaded on first run (empty local storage only).
  const SEED_DOCTORS = [
    ["Alcos", 2, "A"], ["Alingcomot", 1, "C"], ["Bangayan", 3, "A"],
    ["Batao", 2, "B"], ["Bernardino", 1, "A"], ["Boiser", 1, "B"],
    ["Borong", 1, "C"], ["Capangpangan", 3, "B"], ["David", 2, "C"],
    ["Espino", 3, "C"], ["Gaña", 2, "A"], ["Gantuangco", 2, "B"],
    ["Giducos", 3, "A"], ["Gupeteo", 3, "B"], ["Labradores", 2, "C"],
    ["Lisondato", 3, "C"], ["Sebumpan", 2, "A"], ["Sevilla", 2, "B"],
    ["Sorongon", 2, "C"], ["Tenorio", 2, "A"], ["Uy, J", 1, "A"],
    ["Villagonzalo", 2, "B"],
  ];

  function seedState() {
    return {
      doctors: SEED_DOCTORS.map(([name, year, group], i) => ({
        id: "seed-" + (i + 1), name, year, group, leave: [],
      })),
      months: {},
    };
  }

  // ---------- State ----------

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.doctors) && typeof parsed.months === "object") {
          // Migrations: drop legacy "Floor 1 general" data, and convert the old
          // one-doctor-per-room format to per-group slots {A: id, B: id, C: id}.
          for (const m of Object.values(parsed.months)) {
            if (m.assignments) {
              delete m.assignments.f1;
              for (const [roomId, v] of Object.entries(m.assignments)) {
                if (typeof v === "string") {
                  const doc = parsed.doctors.find((d) => d.id === v);
                  m.assignments[roomId] = doc ? { [doc.group]: v } : {};
                }
              }
            }
            for (const k of Object.keys(m.covers || {})) {
              // Old cover keys were "room|date"; new ones are "room|date|group".
              if (k.split("|").length < 3) delete m.covers[k];
            }
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read saved data, starting fresh.", e);
    }
    return seedState();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function uid() {
    return (crypto.randomUUID && crypto.randomUUID()) ||
      "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function getMonthData(monthKey) {
    if (!state.months[monthKey]) {
      state.months[monthKey] = { assignments: {}, covers: {}, anchorGroup: "A", pins: {} };
    }
    const m = state.months[monthKey];
    if (!m.pins) m.pins = {}; // months saved before group pins existed
    return m;
  }

  function getDoctor(id) {
    return state.doctors.find((d) => d.id === id) || null;
  }

  // ---------- DOM refs ----------

  const $ = (sel) => document.querySelector(sel);
  const doctorForm = $("#doctor-form");
  const doctorIdInput = $("#doctor-id");
  const doctorNameInput = $("#doctor-name");
  const doctorYearInput = $("#doctor-year");
  const doctorSubmitBtn = $("#doctor-submit");
  const doctorCancelBtn = $("#doctor-cancel");
  const doctorsTbody = $("#doctors-tbody");
  const noDoctorsNote = $("#no-doctors");
  const monthInput = $("#month-input");
  const anchorGroupSelect = $("#anchor-group");
  const assignmentsGrid = $("#assignments-grid");
  const calendarHead = $("#calendar-head");
  const calendarBody = $("#calendar-body");
  const exportBtn = $("#export-btn");
  const generateBtn = $("#generate-btn");
  const statusFilterBar = $("#status-filter");
  const csvInput = $("#csv-input");
  const csvTemplateBtn = $("#csv-template-btn");
  const printBtn = $("#print-btn");
  const printTitle = $("#print-title");
  const toastEl = $("#toast");

  // Daily-schedule status filter ("Duty" by default per staff workflow).
  let statusFilter = "Duty";

  // ---------- Helpers ----------

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  let toastTimer = null;
  function toast(msg, ok = false) {
    toastEl.textContent = msg;
    toastEl.classList.toggle("ok", ok);
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, 3500);
  }

  function currentMonthKey() {
    return monthInput.value; // "YYYY-MM"
  }

  function daysInMonth(monthKey) {
    const [y, m] = monthKey.split("-").map(Number);
    return new Date(y, m, 0).getDate();
  }

  function dateKey(monthKey, day) {
    return monthKey + "-" + String(day).padStart(2, "0");
  }

  function weekdayName(monthKey, day) {
    const [y, m] = monthKey.split("-").map(Number);
    return new Date(y, m - 1, day).toLocaleDateString(undefined, { weekday: "short" });
  }

  function isWeekend(monthKey, day) {
    const [y, m] = monthKey.split("-").map(Number);
    const dow = new Date(y, m - 1, day).getDay();
    return dow === 0 || dow === 6;
  }

  /** Duty status of a group on a given day of the month (1-based). */
  function groupStatus(group, day, anchorGroup) {
    const gIdx = GROUPS.indexOf(group);
    const aIdx = GROUPS.indexOf(anchorGroup);
    const s = (((day - 1) - (gIdx - aIdx)) % 3 + 3) % 3;
    return STATUSES[s];
  }

  function isOnLeave(doctor, date) {
    return doctor && Array.isArray(doctor.leave) && doctor.leave.includes(date);
  }

  /** Sort for general-room pickers: 1st/2nd years first, then 3rd, alphabetical within year. */
  function byPriority(a, b) {
    const pa = a.year === 3 ? 1 : 0;
    const pb = b.year === 3 ? 1 : 0;
    return pa - pb || a.year - b.year || a.name.localeCompare(b.name);
  }

  /** Whether a doctor satisfies the room's residency-year rule (ER: 2nd, ICU: 3rd). */
  function roomAllows(room, doc) {
    return !room.requiredYear || doc.year === room.requiredYear;
  }

  /** Group pinned to this room for the month, or null. */
  function pinnedGroupFor(monthData, roomId) {
    return (monthData.pins || {})[roomId] || null;
  }

  /** Room id a group is pinned to this month, or null. */
  function groupPinnedRoom(monthData, group) {
    for (const [roomId, g] of Object.entries(monthData.pins || {})) {
      if (g === group) return roomId;
    }
    return null;
  }

  /** The slot a doctor holds this month ({roomId, group}), or null — one floor per doctor. */
  function doctorSlot(monthData, doctorId) {
    for (const room of ROOMS) {
      const slots = monthData.assignments[room.id] || {};
      for (const g of GROUPS) {
        if (slots[g] === doctorId) return { roomId: room.id, group: g };
      }
    }
    return null;
  }

  function monthLabel(monthKey) {
    const [y, m] = monthKey.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: "short", year: "numeric" });
  }

  /** All room assignments and covers a doctor has held, newest first. */
  function doctorHistory(doctorId) {
    const items = [];
    for (const mk of Object.keys(state.months).sort().reverse()) {
      const m = state.months[mk];
      for (const room of ROOMS) {
        const slots = m.assignments[room.id] || {};
        if (GROUPS.some((g) => slots[g] === doctorId)) {
          items.push({ sort: mk, text: `${monthLabel(mk)} · ${room.label}`, cover: false });
        }
      }
      for (const [key, id] of Object.entries(m.covers || {})) {
        if (id !== doctorId) continue;
        const [roomId, date] = key.split("|");
        const room = ROOMS.find((r) => r.id === roomId);
        if (room) items.push({ sort: date, text: `${date} · covered ${room.label}`, cover: true });
      }
    }
    return items.sort((a, b) => b.sort.localeCompare(a.sort));
  }

  // ---------- Doctors panel ----------

  function renderDoctors() {
    doctorsTbody.innerHTML = "";
    noDoctorsNote.hidden = state.doctors.length > 0;

    const sorted = [...state.doctors].sort((a, b) => a.name.localeCompare(b.name));
    for (const doc of sorted) {
      const tr = document.createElement("tr");

      const history = doctorHistory(doc.id);
      const historyHtml = history.length
        ? `<div class="history-list">${history
            .map((h) => `<span class="hist${h.cover ? " hist-cover" : ""}">${escapeHtml(h.text)}</span>`)
            .join("")}</div>`
        : '<span class="unassigned">None yet</span>';

      const leaveChips = (doc.leave || [])
        .slice()
        .sort()
        .map((d) =>
          `<span class="leave-date">${d}` +
          `<button type="button" title="Remove leave date" data-action="remove-leave" data-doctor="${doc.id}" data-date="${d}">&times;</button></span>`
        )
        .join("");

      tr.innerHTML = `
        <td class="cell-doctor">${escapeHtml(doc.name)}</td>
        <td><span class="badge year-${doc.year}">${YEAR_LABEL[doc.year]}</span></td>
        <td>
          <select class="group-select" data-group-doctor="${doc.id}" aria-label="Duty group for ${escapeHtml(doc.name)}">
            ${GROUPS.map((g) => `<option value="${g}"${g === doc.group ? " selected" : ""}>Group ${g}</option>`).join("")}
          </select>
        </td>
        <td>
          <div class="leave-list">${leaveChips || '<span class="unassigned">None</span>'}</div>
          <div class="leave-add">
            <input type="date" data-leave-input="${doc.id}" aria-label="Leave date for ${escapeHtml(doc.name)}" />
            <button type="button" class="btn btn-small" data-action="add-leave" data-doctor="${doc.id}">Add leave</button>
          </div>
        </td>
        <td>${historyHtml}</td>
        <td class="actions-cell">
          <button type="button" class="btn btn-small" data-action="edit" data-doctor="${doc.id}">Edit</button>
          <button type="button" class="btn btn-small btn-danger" data-action="delete" data-doctor="${doc.id}">Remove</button>
        </td>`;
      doctorsTbody.appendChild(tr);
    }
  }

  doctorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = doctorNameInput.value.trim();
    if (!name) { toast("Please enter a doctor name."); return; }
    const year = Number(doctorYearInput.value);
    const editingId = doctorIdInput.value;

    if (editingId) {
      const doc = getDoctor(editingId);
      if (!doc) { resetDoctorForm(); return; }
      doc.name = name;
      doc.year = year;
      const removed = removeInvalidAssignments();
      if (removed > 0) {
        toast(`Updated ${name} — removed ${removed} assignment(s) that no longer fit the ER/ICU year rules.`);
      } else {
        toast(`Updated ${name}.`, true);
      }
    } else {
      const group = autoGroup();
      state.doctors.push({ id: uid(), name, year, group, leave: [] });
      toast(`Added ${name} — auto-assigned to Group ${group}.`, true);
    }
    saveState();
    resetDoctorForm();
    renderAll();
  });

  /** Pick the duty group with the fewest doctors (ties go to A, then B, then C). */
  function autoGroup() {
    const counts = Object.fromEntries(GROUPS.map((g) => [g, 0]));
    for (const d of state.doctors) {
      if (counts[d.group] !== undefined) counts[d.group]++;
    }
    return GROUPS.reduce((best, g) => (counts[g] < counts[best] ? g : best), GROUPS[0]);
  }

  /**
   * Sweep all months and drop assignments/covers that break the rules:
   * deleted doctors or ER/ICU year mismatches. (Slots accept any group —
   * the slot's position, not the doctor's badge group, sets their duty days.)
   */
  function removeInvalidAssignments() {
    let removed = 0;
    for (const monthData of Object.values(state.months)) {
      const seenDocs = new Set();
      for (const room of ROOMS) {
        const slots = monthData.assignments[room.id];
        if (!slots) continue;
        const roomPin = pinnedGroupFor(monthData, room.id);
        for (const g of GROUPS) {
          if (!(g in slots)) continue;
          const doc = getDoctor(slots[g]);
          const reservedRoom = doc && groupPinnedRoom(monthData, doc.group);
          if (!doc || !roomAllows(room, doc) ||
              (roomPin && doc.group !== roomPin) ||              // pinned room: group members only
              (reservedRoom && reservedRoom !== room.id) ||      // reserved doctor: own room only
              seenDocs.has(doc.id)) {                            // one floor per doctor
            delete slots[g];
            removed++;
            continue;
          }
          seenDocs.add(doc.id);
        }
      }
      for (const key of Object.keys(monthData.covers)) {
        const roomId = key.split("|")[0];
        const room = ROOMS.find((r) => r.id === roomId);
        const doc = getDoctor(monthData.covers[key]);
        const roomPin = pinnedGroupFor(monthData, roomId);
        // Reserved doctors may cover anywhere, but a pinned room's covers must
        // come from its own group (everyone on duty there is Group X).
        if (!room || !doc || !roomAllows(room, doc) || (roomPin && doc.group !== roomPin)) {
          delete monthData.covers[key];
          removed++;
        }
      }
    }
    return removed;
  }

  doctorCancelBtn.addEventListener("click", resetDoctorForm);

  function resetDoctorForm() {
    doctorIdInput.value = "";
    doctorForm.reset();
    doctorSubmitBtn.textContent = "Add doctor";
    doctorCancelBtn.hidden = true;
  }

  doctorsTbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    const doc = getDoctor(btn.dataset.doctor);
    if (!doc) return;

    if (action === "edit") {
      doctorIdInput.value = doc.id;
      doctorNameInput.value = doc.name;
      doctorYearInput.value = String(doc.year);
      doctorSubmitBtn.textContent = "Save changes";
      doctorCancelBtn.hidden = false;
      doctorNameInput.focus();
    } else if (action === "delete") {
      if (!confirm(`Remove ${doc.name}? They will be cleared from all assignments.`)) return;
      state.doctors = state.doctors.filter((d) => d.id !== doc.id);
      removeInvalidAssignments();
      saveState();
      renderAll();
      toast(`Removed ${doc.name}.`, true);
    } else if (action === "add-leave") {
      const input = document.querySelector(`input[data-leave-input="${doc.id}"]`);
      const date = input && input.value;
      if (!date) { toast("Pick a date first."); return; }
      doc.leave = doc.leave || [];
      if (doc.leave.includes(date)) { toast(`${doc.name} already has leave on ${date}.`); return; }
      doc.leave.push(date);
      saveState();
      renderAll();
      toast(`Leave added for ${doc.name} on ${date}.`, true);
    } else if (action === "remove-leave") {
      doc.leave = (doc.leave || []).filter((d) => d !== btn.dataset.date);
      saveState();
      renderAll();
    }
  });

  doctorsTbody.addEventListener("change", (e) => {
    const sel = e.target.closest("select[data-group-doctor]");
    if (!sel) return;
    const doc = getDoctor(sel.dataset.groupDoctor);
    if (!doc) return;
    doc.group = sel.value;
    // Joining a group that is pinned to a room vacates their slots elsewhere.
    const removed = removeInvalidAssignments();
    saveState();
    renderAll();
    toast(`${doc.name} moved to Group ${sel.value}.` +
      (removed ? ` Cleared ${removed} assignment(s) that conflict with a group's room.` : ""), true);
  });

  // ---------- Room assignments ----------

  function eligibleDoctorsForRoom(room, group = null) {
    return state.doctors
      .filter((d) => roomAllows(room, d) && (!group || d.group === group))
      .sort(byPriority);
  }

  function buildDoctorOptions(room, selectedId, { group = null, excludeId = null, date = null, reservedMonth = null } = {}) {
    // reservedMonth: exclude doctors whose group is pinned to another room that
    // month (slot pickers pass it; cover pickers don't — covers stay open).
    const docs = eligibleDoctorsForRoom(room, group)
      .filter((d) => d.id !== excludeId)
      .filter((d) => !date || !isOnLeave(d, date))
      .filter((d) => {
        if (!reservedMonth) return true;
        const pr = groupPinnedRoom(reservedMonth, d.group);
        if (pr && pr !== room.id) return false;
        // One floor per doctor: already-slotted doctors only appear in their own slot.
        return d.id === selectedId || !doctorSlot(reservedMonth, d.id);
      });

    const optionFor = (d) => {
      const sel = d.id === selectedId ? " selected" : "";
      return `<option value="${d.id}"${sel}>${escapeHtml(d.name)} (${YEAR_LABEL[d.year]}, Grp ${d.group})</option>`;
    };

    if (room.special) {
      return docs.map(optionFor).join("");
    }
    const juniors = docs.filter((d) => d.year !== 3);
    const seniors = docs.filter((d) => d.year === 3);
    let html = "";
    if (juniors.length) html += `<optgroup label="1st/2nd year (preferred)">${juniors.map(optionFor).join("")}</optgroup>`;
    if (seniors.length) html += `<optgroup label="3rd year (use if needed)">${seniors.map(optionFor).join("")}</optgroup>`;
    return html;
  }

  function renderAssignments() {
    const monthKey = currentMonthKey();
    const monthData = getMonthData(monthKey);
    assignmentsGrid.innerHTML = "";

    for (const room of ROOMS) {
      const card = document.createElement("div");
      const pin = pinnedGroupFor(monthData, room.id);
      card.className = "room-card" + (room.special ? " special" : "") + (pin ? " pinned" : "");
      const slots = monthData.assignments[room.id] || {};
      const req = room.requiredYear ? ` · ${YEAR_LABEL[room.requiredYear]}s only` : "";

      // General floors can be handed to a whole group for the month.
      const pinControl = room.special ? "" : `
        <label class="pin-row">
          <span>Whole group</span>
          <select data-pin-room="${room.id}" aria-label="Group assigned to ${room.label} for the month">
            <option value="">— Individual slots —</option>
            ${GROUPS.map((g) => `<option value="${g}"${g === pin ? " selected" : ""}>Group ${g}</option>`).join("")}
          </select>
        </label>`;

      // A pinned room keeps its three rotation slots (that's what guarantees a
      // Duty doctor daily) — but only the pinned group's doctors may fill them.
      const note = pin
        ? `<div class="pin-note"><span class="badge group">Group ${pin} doctors only</span></div>`
        : "";
      const body = note + GROUPS.map((g) => `
        <label class="slot-row">
          <span class="grp-tag">${g}</span>
          <select data-room="${room.id}" data-group="${g}" aria-label="Slot ${g} doctor for ${room.label}">
            <option value="">— Unassigned —</option>
            ${buildDoctorOptions(room, slots[g] || "", { group: pin || null, reservedMonth: monthData })}
          </select>
        </label>`).join("");

      card.innerHTML = `
        <div class="room-name">${room.label}</div>
        <div class="room-sub">${room.sub}${req}</div>
        ${pinControl}
        ${body}`;
      assignmentsGrid.appendChild(card);
    }
  }

  assignmentsGrid.addEventListener("change", (e) => {
    const monthData = getMonthData(currentMonthKey());

    // Group pin selector on general floors.
    const pinSelect = e.target.closest("select[data-pin-room]");
    if (pinSelect) {
      const room = ROOMS.find((r) => r.id === pinSelect.dataset.pinRoom);
      const g = pinSelect.value;
      if (!g) {
        delete monthData.pins[room.id];
        saveState();
        renderAll();
        toast(`${room.label} is no longer restricted to one group.`, true);
        return;
      }
      const already = groupPinnedRoom(monthData, g);
      if (already && already !== room.id) {
        const other = ROOMS.find((r) => r.id === already);
        toast(`Group ${g} is already assigned to ${other ? other.label : already} this month. Unassign it there first.`);
        pinSelect.value = pinnedGroupFor(monthData, room.id) || "";
        return;
      }
      monthData.pins[room.id] = g;
      const cleared = removeInvalidAssignments();
      saveState();
      renderAll();
      toast(`${room.label} is reserved for Group ${g} this month — fill its slots with Group ${g} doctors.` +
        (cleared ? ` Cleared ${cleared} conflicting assignment(s).` : ""), true);
      return;
    }

    const select = e.target.closest("select[data-room]");
    if (!select) return;
    const room = ROOMS.find((r) => r.id === select.dataset.room);
    const g = select.dataset.group;
    const slots = monthData.assignments[room.id] || (monthData.assignments[room.id] = {});
    const doctorId = select.value;

    if (!doctorId) {
      delete slots[g];
    } else {
      const doc = getDoctor(doctorId);
      // Validation: ER accepts 2nd years only, ICU 3rd years only.
      if (!doc || !roomAllows(room, doc)) {
        toast(`${doc ? doc.name : "That doctor"} cannot be assigned to the ${room.label}: only ${YEAR_LABEL[room.requiredYear]} residents may staff it.`);
        select.value = slots[g] || "";
        return;
      }
      // A pinned room only accepts doctors from its group.
      const roomPin = pinnedGroupFor(monthData, room.id);
      if (roomPin && doc.group !== roomPin) {
        toast(`${room.label} is reserved for Group ${roomPin} this month — ${doc.name} is in Group ${doc.group}.`);
        select.value = slots[g] || "";
        return;
      }
      // A doctor whose group owns another room is reserved for it.
      const reservedRoom = groupPinnedRoom(monthData, doc.group);
      if (reservedRoom && reservedRoom !== room.id) {
        const other = ROOMS.find((r) => r.id === reservedRoom);
        toast(`${doc.name} is in Group ${doc.group}, which is assigned to ${other ? other.label : reservedRoom} this month.`);
        select.value = slots[g] || "";
        return;
      }
      // One floor per doctor per month.
      const held = doctorSlot(monthData, doctorId);
      if (held && !(held.roomId === room.id && held.group === g)) {
        const other = ROOMS.find((r) => r.id === held.roomId);
        toast(`${doc.name} is already assigned to ${other ? other.label : held.roomId} (slot ${held.group}) this month — one floor per doctor.`);
        select.value = slots[g] || "";
        return;
      }
      slots[g] = doctorId;
    }
    saveState();
    renderAssignments(); // other rooms' pickers must drop/regain this doctor
    renderCalendar();
  });

  // ---------- Calendar ----------

  function renderCalendar() {
    const monthKey = currentMonthKey();
    const monthData = getMonthData(monthKey);
    const numDays = daysInMonth(monthKey);

    const [py, pm] = monthKey.split("-").map(Number);
    printTitle.textContent = "DDH Doctor Schedule — " +
      new Date(py, pm - 1, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });

    calendarHead.innerHTML = `
      <tr>
        <th class="date-col">Date</th>
        <th class="rotation-col">Duty rotation</th>
        ${ROOMS.map((r) => {
          const pin = pinnedGroupFor(monthData, r.id);
          return `<th>${r.label}${r.special ? " ⭑" : ""}${pin ? ` · Grp ${pin}` : ""}<br><small>${r.sub}</small></th>`;
        }).join("")}
      </tr>`;

    calendarBody.innerHTML = "";

    for (let day = 1; day <= numDays; day++) {
      const date = dateKey(monthKey, day);
      const tr = document.createElement("tr");
      if (isWeekend(monthKey, day)) tr.classList.add("weekend");

      const rotationHtml = GROUPS.map((g) => {
        const status = groupStatus(g, day, monthData.anchorGroup);
        const dim = statusFilter !== "all" && status !== statusFilter ? " filtered-out" : "";
        return `<div class="rotation-line${dim}"><span class="grp">${g}</span><span class="chip ${STATUS_CLASS[status]}">${status}</span></div>`;
      }).join("");

      let cells = `
        <td class="date-col">${day} <small>${weekdayName(monthKey, day)}</small></td>
        <td class="rotation-col">${rotationHtml}</td>`;

      for (const room of ROOMS) {
        cells += renderRoomCell(room, date, day, monthData);
      }
      tr.innerHTML = cells;
      calendarBody.appendChild(tr);
    }
  }

  function renderRoomCell(room, date, day, monthData) {
    // One line per group slot. The slot's status follows its GROUP's rotation
    // (a cover steps into that shift). Slots not matching the filter are dimmed,
    // except unresolved leave (always visible — it needs attention).
    const pin = pinnedGroupFor(monthData, room.id);
    const slots = monthData.assignments[room.id] || {};
    const parts = [];

    for (const g of GROUPS) {
      const status = groupStatus(g, day, monthData.anchorGroup);
      const statusChip = `<span class="chip ${STATUS_CLASS[status]}">${status}</span>`;
      const dim = statusFilter !== "all" && status !== statusFilter ? " filtered-out" : "";
      const doc = getDoctor(slots[g]);

      if (!doc) {
        parts.push(`<div class="slot${dim}"><span class="unassigned">No Grp ${g} doctor</span>${statusChip}</div>`);
        continue;
      }

      // Flag doctors sitting in a slot that differs from their badge group.
      const grpTag = doc.group !== g
        ? `<span class="badge group" title="Badge group ${doc.group}, working slot ${g}">Grp ${doc.group}</span>`
        : "";

      const coverKey = `${room.id}|${date}|${g}`;
      if (!isOnLeave(doc, date)) {
        parts.push(`<div class="slot${dim}">
          <span class="cell-doctor">${escapeHtml(doc.name)}</span>
          <span class="badge year-${doc.year}">Y${doc.year}</span>${grpTag}${statusChip}
        </div>`);
        continue;
      }

      const cover = getDoctor(monthData.covers[coverKey]);
      if (cover && !isOnLeave(cover, date)) {
        parts.push(`<div class="slot slot-covered${dim}">
          <span class="cell-doctor">${escapeHtml(cover.name)}</span>
          <span class="badge year-${cover.year}">Y${cover.year}</span>${statusChip}
          <span class="chip cover-chip">Covering</span>
          <span class="chip leave-chip">${escapeHtml(doc.name)} on leave</span>
          <button type="button" class="btn btn-small" data-action="remove-cover" data-cover-key="${coverKey}">Clear</button>
        </div>`);
        continue;
      }

      const options = buildDoctorOptions(room, "", { excludeId: doc.id, date, group: pin });
      const note = cover ? `<span class="chip leave-chip">Cover ${escapeHtml(cover.name)} also on leave!</span>` : "";
      parts.push(`<div class="slot slot-leave">
        <span class="cell-doctor">${escapeHtml(doc.name)}</span>
        <span class="badge year-${doc.year}">Y${doc.year}</span>${statusChip}
        <span class="chip leave-chip">On leave</span>${note}
        <select class="cover-select" data-cover-key="${coverKey}" data-room="${room.id}" aria-label="Cover for ${room.label} Group ${g} on ${date}">
          <option value="">— Assign cover —</option>
          ${options}
        </select>
      </div>`);
    }

    return `<td>${parts.join("")}</td>`;
  }

  calendarBody.addEventListener("change", (e) => {
    const select = e.target.closest("select[data-cover-key]");
    if (!select) return;
    const monthData = getMonthData(currentMonthKey());
    const room = ROOMS.find((r) => r.id === select.dataset.room);
    const doctorId = select.value;

    if (!doctorId) {
      delete monthData.covers[select.dataset.coverKey];
    } else {
      const doc = getDoctor(doctorId);
      if (!doc || !roomAllows(room, doc)) {
        toast(`${doc ? doc.name : "That doctor"} cannot cover the ${room.label}: only ${YEAR_LABEL[room.requiredYear]} residents may staff it.`);
        select.value = "";
        return;
      }
      const roomPin = pinnedGroupFor(monthData, room.id);
      if (roomPin && doc.group !== roomPin) {
        toast(`Only Group ${roomPin} doctors can cover the ${room.label} this month.`);
        select.value = "";
        return;
      }
      const date = select.dataset.coverKey.split("|")[1];
      if (isOnLeave(doc, date)) {
        toast(`${doc.name} is on leave on ${date} and cannot cover.`);
        select.value = "";
        return;
      }
      monthData.covers[select.dataset.coverKey] = doctorId;
    }
    saveState();
    renderCalendar();
  });

  calendarBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action='remove-cover']");
    if (!btn) return;
    const monthData = getMonthData(currentMonthKey());
    delete monthData.covers[btn.dataset.coverKey];
    saveState();
    renderCalendar();
  });

  statusFilterBar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;
    statusFilter = btn.dataset.filter;
    for (const b of statusFilterBar.querySelectorAll("button[data-filter]")) {
      b.classList.toggle("active", b === btn);
    }
    renderCalendar();
  });

  // ---------- Month & rotation controls ----------

  monthInput.addEventListener("change", () => {
    if (!monthInput.value) return;
    anchorGroupSelect.value = getMonthData(currentMonthKey()).anchorGroup;
    saveState();
    renderAll();
  });

  anchorGroupSelect.addEventListener("change", () => {
    getMonthData(currentMonthKey()).anchorGroup = anchorGroupSelect.value;
    saveState();
    renderCalendar();
  });

  // ---------- Auto-generate schedule ----------

  generateBtn.addEventListener("click", () => {
    if (!state.doctors.length) {
      toast("Add doctors first, then generate the schedule.");
      return;
    }
    const monthKey = currentMonthKey();
    const monthData = getMonthData(monthKey);

    if (Object.keys(monthData.assignments).length &&
        !confirm(`Regenerate the schedule for ${monthKey}?\n\nThis month's room assignments will be replaced (rooms owned by a group are kept). You can still adjust everything afterwards.`)) {
      return;
    }

    // 1. Balance duty groups: seniors first, round-robin A/B/C so each group
    //    gets a spread of residency years. Skipped when a group is pinned to a
    //    room this month — rebalancing would reshuffle that group's membership.
    const hasPins = Object.keys(monthData.pins || {}).length > 0;
    if (!hasPins) {
      const byYearDesc = [...state.doctors].sort(
        (a, b) => b.year - a.year || a.name.localeCompare(b.name)
      );
      byYearDesc.forEach((d, i) => { d.group = GROUPS[i % GROUPS.length]; });
    }

    // 2. Fill every room with one doctor per group so each room has someone on
    //    Duty daily. Specials first (their pools are restricted by year), then
    //    generals with 1st/2nd years preferred. Less leave this month wins ties.
    const leaveDays = (d) =>
      (d.leave || []).filter((x) => x.startsWith(monthKey + "-")).length;
    const used = new Set();
    // Prefer a doctor whose badge group matches the slot, but any group works —
    // the slot's position is what sets their duty days.
    const pickFor = (room, g) => {
      const roomPin = pinnedGroupFor(monthData, room.id);
      const pool = state.doctors
        .filter((d) => {
          if (!roomAllows(room, d) || used.has(d.id)) return false;
          if (roomPin) return d.group === roomPin;        // pinned room: its group only
          return !groupPinnedRoom(monthData, d.group);    // elsewhere: skip reserved doctors
        })
        .sort((a, b) => {
          const ga = a.group === g ? 0 : 1;
          const gb = b.group === g ? 0 : 1;
          const pa = !room.requiredYear && a.year === 3 ? 1 : 0;
          const pb = !room.requiredYear && b.year === 3 ? 1 : 0;
          return ga - gb || pa - pb || a.year - b.year || leaveDays(a) - leaveDays(b) || a.name.localeCompare(b.name);
        });
      return pool[0] || null;
    };

    const assignments = {};
    const ordered = [...ROOMS.filter((r) => r.special), ...ROOMS.filter((r) => !r.special)];
    for (const room of ordered) {
      assignments[room.id] = {};
      for (const g of GROUPS) {
        const pick = pickFor(room, g);
        if (pick) { assignments[room.id][g] = pick.id; used.add(pick.id); }
      }
    }
    monthData.assignments = assignments;

    // Drop covers that no longer make sense under the new assignments.
    for (const key of Object.keys(monthData.covers)) {
      const [roomId, , g] = key.split("|");
      const slotDoc = assignments[roomId] && assignments[roomId][g];
      if (!slotDoc || monthData.covers[key] === slotDoc) {
        delete monthData.covers[key];
      }
    }

    saveState();
    renderAll();

    const gaps = [];
    for (const room of ROOMS) {
      for (const g of GROUPS) {
        if (!assignments[room.id][g]) gaps.push(`${room.label} Grp ${g}`);
      }
    }
    if (gaps.length) {
      toast(`Schedule generated, but some slots could not be filled: ${gaps.join(", ")}. ` +
        `The ER needs three 2nd years and the ICU three 3rd years.`);
    } else {
      toast(`Schedule generated for ${monthKey} — every room has a doctor on Duty daily.`, true);
    }
  });

  // ---------- CSV import / template ----------

  /** Minimal CSV parser: quoted fields, embedded commas/quotes, CRLF, BOM. */
  function parseCsv(text) {
    const rows = [];
    let row = [], field = "", inQuotes = false;
    text = text.replace(/^\uFEFF/, "");
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else field += c;
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field); field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); field = "";
        rows.push(row); row = [];
      } else {
        field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows.filter((r) => r.some((f) => f.trim() !== ""));
  }

  function importDoctorsCsv(text) {
    const rows = parseCsv(text);
    if (!rows.length) { toast("The CSV file is empty."); return; }

    // Header row? Map columns by name; otherwise assume Name, Year, Group order.
    let [nameCol, yearCol, groupCol] = [0, 1, 2];
    let dataRows = rows;
    const head = rows[0].map((c) => c.trim().toLowerCase());
    if (head.some((c) => c.includes("name"))) {
      nameCol = head.findIndex((c) => c.includes("name"));
      yearCol = head.findIndex((c) => c.includes("year"));
      groupCol = head.findIndex((c) => c.includes("group"));
      dataRows = rows.slice(1);
    }

    const parsed = [];
    const problems = [];
    const seen = new Set();
    dataRows.forEach((r, i) => {
      const line = i + (dataRows === rows ? 1 : 2);
      const name = (r[nameCol] || "").trim();
      if (!name) { problems.push(`line ${line}: missing name`); return; }
      if (seen.has(name.toLowerCase())) { problems.push(`line ${line}: duplicate "${name}" skipped`); return; }
      const yearMatch = String(r[yearCol] || "").match(/[1-3]/);
      if (!yearMatch) { problems.push(`line ${line}: "${name}" has no residency year (1–3)`); return; }
      const groupMatch = String(r[groupCol] || "").trim().match(/^([ABCabc])/);
      seen.add(name.toLowerCase());
      parsed.push({ name, year: Number(yearMatch[0]), group: groupMatch ? groupMatch[1].toUpperCase() : null });
    });

    if (!parsed.length) {
      toast("No valid doctors found in the CSV. " + (problems[0] || ""));
      return;
    }

    const byName = new Map(state.doctors.map((d) => [d.name.toLowerCase(), d]));
    const added = parsed.filter((p) => !byName.has(p.name.toLowerCase())).length;
    const kept = parsed.length - added;
    const removedCount = state.doctors.length - kept;

    if (!confirm(
      `Import roster from CSV?\n\n` +
      `• ${added} new doctor(s)\n` +
      `• ${kept} existing doctor(s) updated (leave dates kept)\n` +
      `• ${removedCount} doctor(s) not in the file will be removed\n` +
      (problems.length ? `• ${problems.length} row(s) skipped: ${problems.slice(0, 3).join("; ")}${problems.length > 3 ? "…" : ""}\n` : "")
    )) return;

    const newDoctors = [];
    for (const p of parsed) {
      const existing = byName.get(p.name.toLowerCase());
      if (existing) {
        newDoctors.push({ ...existing, name: p.name, year: p.year, group: p.group || existing.group });
      } else {
        // Balance unassigned groups against the roster built so far.
        const counts = Object.fromEntries(GROUPS.map((g) => [g, 0]));
        newDoctors.forEach((d) => counts[d.group]++);
        const group = p.group || GROUPS.reduce((best, g) => (counts[g] < counts[best] ? g : best), GROUPS[0]);
        newDoctors.push({ id: uid(), name: p.name, year: p.year, group, leave: [] });
      }
    }
    state.doctors = newDoctors;
    const swept = removeInvalidAssignments();
    saveState();
    renderAll();
    toast(`Roster imported: ${added} added, ${kept} updated, ${removedCount} removed.` +
      (swept ? ` Cleared ${swept} assignment(s) that no longer fit.` : ""), true);
  }

  csvInput.addEventListener("change", () => {
    const file = csvInput.files && csvInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => importDoctorsCsv(String(reader.result));
    reader.onerror = () => toast("Could not read the file.");
    reader.readAsText(file);
    csvInput.value = ""; // allow re-importing the same file
  });

  csvTemplateBtn.addEventListener("click", () => {
    const csvField = (s) => (/[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s);
    const lines = ["Name,Year,Group"];
    if (state.doctors.length) {
      for (const d of [...state.doctors].sort((a, b) => a.name.localeCompare(b.name))) {
        lines.push(`${csvField(d.name)},${d.year},${d.group}`);
      }
    } else {
      lines.push("Dela Cruz,1,A", "Reyes,2,B", "Santos,3,C");
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ddh-doctors.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // ---------- Print ----------

  printBtn.addEventListener("click", () => window.print());

  // ---------- Export ----------

  exportBtn.addEventListener("click", () => {
    const monthKey = currentMonthKey();
    const monthData = getMonthData(monthKey);
    const numDays = daysInMonth(monthKey);

    const docSummary = (id) => {
      const d = getDoctor(id);
      return d ? { id: d.id, name: d.name, year: d.year, group: d.group } : null;
    };

    const days = [];
    for (let day = 1; day <= numDays; day++) {
      const date = dateKey(monthKey, day);
      const rotation = Object.fromEntries(
        GROUPS.map((g) => [g, groupStatus(g, day, monthData.anchorGroup)])
      );
      const rooms = {};
      for (const room of ROOMS) {
        const roomSlots = monthData.assignments[room.id] || {};
        const slots = {};
        let onDuty = null;
        for (const g of GROUPS) {
          const doc = getDoctor(roomSlots[g]);
          const status = groupStatus(g, day, monthData.anchorGroup);
          const onLeave = doc ? isOnLeave(doc, date) : false;
          const cover = onLeave ? docSummary(monthData.covers[`${room.id}|${date}|${g}`]) : null;
          slots[g] = {
            doctor: doc ? docSummary(doc.id) : null,
            status,
            onLeave,
            cover,
          };
          if (status === "Duty") {
            onDuty = cover || (doc && !onLeave ? docSummary(doc.id) : null);
          }
        }
        rooms[room.id] = {
          room: room.label,
          type: room.special ? "special" : "general",
          requiredYear: room.requiredYear,
          pinnedGroup: pinnedGroupFor(monthData, room.id),
          slots,
          onDuty,
        };
      }
      days.push({ date, rotation, rooms });
    }

    const payload = {
      app: "DDH Doctor Scheduler",
      exportedAt: new Date().toISOString(),
      month: monthKey,
      anchorGroup: monthData.anchorGroup,
      doctors: state.doctors.map((d) => ({ ...d })),
      days,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ddh-schedule-${monthKey}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast(`Exported schedule for ${monthKey}.`, true);
  });

  // ---------- Init ----------

  function renderAll() {
    renderDoctors();
    renderAssignments();
    renderCalendar();
  }

  (function init() {
    const now = new Date();
    monthInput.value = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    anchorGroupSelect.value = getMonthData(currentMonthKey()).anchorGroup;
    renderAll();
  })();
})();
