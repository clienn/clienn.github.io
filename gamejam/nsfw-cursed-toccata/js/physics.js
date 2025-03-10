/*
 * PHYSICS
 */
function transformPoint(rect, cx, cy, radians) {
    // var radians = rotationDegrees * (Math.PI / 180);
    
    // Translate rotation
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);

    let px = rect.x - cx;
    let py = rect.y - cy;


    var x = (px * cos) - (py * sin);
    var y = (px * sin) + (py * cos);

    x += cx;
    y += cy;

    return { x, y };
}

function getRotatedRect(rect, radians) {
    let cx = (rect.x + rect.w / 2); 
    let cy = (rect.y + rect.h / 2); 

    return [
        transformPoint({ x: rect.x, y: rect.y }, cx, cy, radians),
        transformPoint({ x: rect.x + rect.w, y: rect.y }, cx, cy, radians),
        transformPoint({ x: rect.x + rect.w, y: rect.y + rect.h }, cx, cy, radians),
        transformPoint({ x: rect.x, y: rect.y + rect.h }, cx, cy, radians)
    ];
}

function checkAngledCollisions(obj1, obj2) {
    return doPolygonsIntersect(
        getRotatedRect(obj1, obj1.radians),
        getRotatedRect(obj2, obj2.radians)
    );
}

function doPolygonsIntersect (a, b) {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {

        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {

            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = null;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (minA == null || projected < minA) {
                    minA = projected;
                }
                if (maxA == null || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = null;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (minB == null || projected < minB) {
                    minB = projected;
                }
                if (maxB == null || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                // CONSOLE("polygons don't intersect!");
                return false;
            }
        }
    }
    return true;
}

function radiansToDeg(radians) {
    return radians * 180 / Math.PI;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}


// *********************************** PHYSICS END ******************************************************** //