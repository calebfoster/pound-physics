import $ from 'jquery'
import 'pathseg'
window['decomp'] = require('poly-decomp')

import Matter from 'matter-js'
import goldFistConnectorImage from 'url:./img/gold-fist-connector.png'
import goldFist from 'url:./img/gold-fist.png'
import chainLinkLeftUrl from 'url:./img/chain-link-left.png'
import goldFistPendulumLink from 'url:./img/gold-fist-pendulum-link.png'
import pendulumAmazonite from 'url:./img/pendulum-amazonite.png'
import pendulumAmazoniteSvg from 'url:./img/pendulum-amazonite.svg'

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Svg = Matter.Svg

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    element: document.getElementById('chains'),
    engine: engine,
    options: {
        width: 1200,
        height: 800,
        background: 'transparent',
        wireframeBackground: 'transparent',
        wireframes: false,
        // showAngleIndicator: true,
        // showBounds: true,
        // wireframes: true,
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

const startX = 495
const startY = -65

// left chain
var group = Body.nextGroup(true);
const leftChain = Composites.stack(startX, startY, 1, 8, 0, 53, function(x, y) {
    return Bodies.rectangle(x, y / 2, 18, 53, {
        collisionFilter: { group: group, chamfer: 5 },
        render: {
            anchors: false,
            strokeStyle: '#ffffff',
            sprite: {
                texture: chainLinkLeftUrl,
            }
        }
    })
})
Composites.chain(leftChain, 0, 0.4, 0, -0.4, {
    stiffness: 1,
    length: 0,
    damping: 0.8,
    anchors: false,
    render: {
        anchors: false,
    }
});
Composite.add(leftChain, Constraint.create({ 
    bodyB: leftChain.bodies[0],
    pointA: { x: leftChain.bodies[0].position.x, y: leftChain.bodies[0].position.y },
    pointB: { x: 0, y: -7 },
    stiffness: 1,
}));

// right chain
// group = Body.nextGroup(true)
const rightChain = Composites.stack(startX + 200, startY, 1, 8, 0, 53, function(x, y) {
    return Bodies.rectangle(x, y / 2, 18, 53, {
        collisionFilter: { group: group, chamfer: 5 },
        render: {
            strokeStyle: '#ffffff',
            sprite: {
                texture: chainLinkLeftUrl,
            }
        }
    });
});
Composites.chain(rightChain, 0, 0.4, 0, -0.4, {
    stiffness: 1,
    length: 0,
    damping: 0.8,
});
Composite.add(rightChain, Constraint.create({ 
    bodyB: rightChain.bodies[0],
    pointA: { x: rightChain.bodies[0].position.x, y: rightChain.bodies[0].position.y },
    pointB: { x: 0, y: -7 },
    stiffness: 1,
}));



;(async () => {
    let data

    // fist
    // data = await $.get(fistGoldSvg)
    // $(data).find('path').each((i, path) => {
    //     const vertexSets = []
    //     vertexSets.push(Svg.pathToVertices(path, 15))
    //     World.add(world, Bodies.fromVertices(100 + i * 150, 200 + i * 50, vertexSets, {
    //         render: {
    //             fillStyle: 'red',
    //             strokeStyle: 'white',
    //             lineWidth: 1,
    //             sprite: {
    //                 texture: fistGold,
    //             },
    //         }
    //     }, true));    
    // })

    // group = Body.nextGroup(true)

    const goldFistConnector = Bodies.rectangle(startX + 100, startY + 500, 43, 47, {
        collisionFilter: { group: group, chamfer: 5 },
        render: {
            strokeStyle: '#ffffff',
            sprite: {
                texture: goldFistConnectorImage,
            },
        }
    })

    const fist = Bodies.rectangle(startX + 100, startY + 500, 66, 126, {
        collisionFilter: { group: group, chamfer: 5 },
        render: {
            strokeStyle: '#ffffff',
            sprite: {
                texture: goldFist,
            },
        }
    })

    // group = Body.nextGroup(true)

    // pendulum chain
    const pendulumChain = Composites.stack(startX + 100, startY + 600, 1, 1, 0, 0, function(x, y) {
        return Bodies.rectangle(x, y, 8, 31, {
            collisionFilter: { group: group, chamfer: 5 },
            render: {
                strokeStyle: '#ffffff',
                sprite: {
                    texture: goldFistPendulumLink,
                }
            }
        })
    })
    
    // pendulum
    data = await $.get(pendulumAmazoniteSvg)
    let pendulum;
    $(data).find('path').each((i, path) => {
        const vertexSets = []
        vertexSets.push(Svg.pathToVertices(path, 30))
        // pendulum = World.add(world, Bodies.fromVertices(star500 + i * 150, 200 + i * 50, vertexSets, {
        pendulum = World.add(world, Bodies.fromVertices(startX + 100 + i * 150, startY + 400 + i * 50, vertexSets, {
            render: {
                fillStyle: 'red',
                strokeStyle: 'white',
                lineWidth: 1,
                sprite: {
                    texture: pendulumAmazonite
                },
            }
        }, true));
        
    })



    // constraints
    // fist connector to left chain
    const connectorToLeftChain = Constraint.create({
        bodyA: leftChain.bodies[leftChain.bodies.length - 1],
        bodyB: goldFistConnector,
        pointA: { x: 0, y: 23 },
        pointB: { x: -15, y: -20 },
        length: 0,
        stiffness: 1,
        render: {
            anchors: false,
        }
    })

    // fist connector to right chain
    const connectorToRightChain = Constraint.create({
        bodyB: rightChain.bodies[rightChain.bodies.length - 1],
        bodyA: goldFistConnector,
        pointB: { x: 0, y: 23 },
        pointA: { x: 18, y: -17 },
        length: 0,
        stiffness: 1,
        render: {
            anchors: false,
        }
    })

    // fist to fist connector
    const fistToConnector = Constraint.create({
        bodyB: goldFistConnector,
        bodyA: fist,
        pointB: { x: 0, y: 23 },
        pointA: { x: 0, y: -55 },
        length: 0,
        stiffness: 1,
        render: {
            anchors: false,
        }
    })

    // pendulum link to fist
    const pendulumChainToFist = Constraint.create({
        bodyA: fist,
        bodyB: pendulumChain.bodies[0],
        pointA: { x: 2, y: 65 },
        pointB: { x: 0, y: -10 },
        length: 0,
        stiffness: 1,
        render: {
            anchors: false,
        }
    })

    // pendulum to pendulum chain
    const pendulumToPendulumChain = Constraint.create({
        bodyA: pendulumChain.bodies[pendulumChain.bodies.length - 1],
        bodyB: pendulum.bodies[1],
        pointA: { x: 0, y: 15 },
        pointB: { x: 0, y: -98 },
        length: 0,
        stiffness: 1,
        render: {
            anchors: false,
        }
    })



    World.add(world, [
        fist,
        goldFistConnector,
        pendulumChain,

        // constraints
        connectorToLeftChain,
        connectorToRightChain,
        fistToConnector,
        pendulumChainToFist,
        pendulumToPendulumChain,
    ])
    
})()





// group = Body.nextGroup(true);

// var ropeB = Composites.stack(350, 50, 10, 1, 10, 10, function(x, y) {
//     return Bodies.circle(x, y, 20, { collisionFilter: { group: group } });
// });

// Composites.chain(ropeB, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2, render: { type: 'line' } });
// Composite.add(ropeB, Constraint.create({ 
//     bodyB: ropeB.bodies[0],
//     pointB: { x: -20, y: 0 },
//     pointA: { x: ropeB.bodies[0].position.x, y: ropeB.bodies[0].position.y },
//     stiffness: 0.5
// }));

World.add(world, [
    leftChain,
    rightChain,
    Bodies.rectangle(0, -50.5, 4000, 50, { isStatic: true }),
    // Bodies.rectangle(400, 1000, 1200, 50.5, { isStatic: true })
]);

// World.addBody(world, pendulum)

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 1,
        render: {
            visible: false
        }
    }
});

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 1200, y: 900 }
});
