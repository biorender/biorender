'use strict'

import { createScene, createStats } from './lib/create.js'

const { scene, camera, renderer } = createScene({
  clearColor: 0x393939,
  antialias: true,
  size: 1
})
window.scene = scene

// ===========================================================================

camera.position.set(0,75,0)

// ===========================================================================

import sceneGraphConstructor from './scene'
const sceneGraph = sceneGraphConstructor()

const keyframes = []
for (let obj3DKey of Object.keys(sceneGraph)) {
  const obj3D = sceneGraph[obj3DKey]

  if (obj3D.keyframe) {
    keyframes.push(obj3D.keyframe)
  }

  scene.add(obj3D)
}

// ===========================================================================

import { OBJLoaderAsync, textureLoader } from './lib/loaders.js'
import { makeLOD } from './lib/lod.js'
import { flatUIHexColors, generateShades } from './lib/colour-utils.js'

import {
  crudeSynthaseCreator,
  crudeDimerCreator,
  dimerCreator,
  constructSynthase,
  constructDimer
} from './scene/meshes/atp-synthase.js'

import { constructCristae } from './scene/meshes/cristae.js'
import { constructETC } from './scene/meshes/etc.js'

// === FUNCTIONS ===

const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const mesh = (geometry, materials) => {
  if (Array.isArray(materials)) {
    return new THREE.SceneUtils.createMultiMaterialObject(geometry, materials)
  } else {
    return new THREE.Mesh(geometry, materials)
  }
}

const randMaterial = () => {
  return new THREE.MeshLambertMaterial({
    color: flatUIHexColors[Math.floor(Math.random()*flatUIHexColors.length)],
    transparent: true,
    opacity: 0.6
  })
}

// === LOADERS ===

const OBJLoader = new THREE.OBJLoader()

// === CONTROLS ===
const controls = new THREE.OrbitControls(camera, renderer.domElement)
// const controls = new THREE.FlyControls(camera)
// controls.movementSpeed = 5 //0.5
// controls.domElement = renderer.domElement
// controls.rollSpeed = (Math.PI / 6)*10
// controls.autoForward = false
// controls.dragToLook = false

// === INIT METHODS ===

const initGlobalLights = () => {
  const cLight = new THREE.PointLight(0xffffff, 1, 50)
  camera.add(cLight)
  cLight.position.set(0,0,-0.001)

  camera.lookAt(new THREE.Vector3(0,0,0))
  scene.add(camera)

  const aLight = new THREE.AmbientLight(0xe6e6e6, 0.5)
  scene.add(aLight)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 10),
    new THREE.MeshLambertMaterial({color: 0xfbeec4, side: THREE.DoubleSide})
  )
}

let topLayer, octree
const initMembrane = (length, width, thickness, useWireframe=true) => {
  const planeGeom = new THREE.PlaneGeometry(length, width, length, width)
  const mat = new THREE.MeshLambertMaterial({color: 0xbababa, side: THREE.DoubleSide})
  const wireframe = new THREE.MeshBasicMaterial({color: 0xaaaaaa, wireframe: true})

  let materials
  if (useWireframe) {
    materials = [mat, wireframe]
  } else {
    materials = mat
  }

  topLayer = mesh(planeGeom, materials)
  topLayer.rotation.x = Math.PI/2
  topLayer.position.set(0, thickness/2, 0)
  scene.add(topLayer)

  const bottomLayer = topLayer.clone()
  bottomLayer.rotation.x = Math.PI/2
  bottomLayer.position.set(0, -(thickness/2), 0)
  scene.add(bottomLayer)
}

const fillWithGoblin = (mesh) => {
  const verts = mesh.geometry.vertices
  // uses half dimensions
  const goblinBox = new Goblin.RigidBody(new Goblin.BoxShape(2, 3, 2))
  let addedBlocks = []

  const addNewBox = (vert) => {
    const newBlock = new Goblin.RigidBody(new Goblin.BoxShape(2, 3, 2))
    newBlock.position = new Goblin.Vector3(vert.x, vert.y, vert.z)
    newBlock.updateDerived()

    addedBlocks.push(newBlock)

    octree.add({x: vert.x, y: vert.y, z: vert.z, radius: 4, id: addedBlocks.length - 1})
    octree.update()

    const newProtein = new THREE.Mesh(new THREE.BoxGeometry(4, 6, 4), randMaterial())
    newProtein.position.set(vert.x, vert.y, vert.z)

    scene.add(newProtein)
  }

  for (let i=0; i < verts.length; i+= 1) {
    // Rotate and realign vertex
    const vert = (new THREE.Vector3(verts[i].x, verts[i].y, verts[i].z)).applyEuler(mesh.rotation)
    vert.x = vert.x + mesh.position.x
    vert.y = vert.y + mesh.position.y
    vert.z = vert.z + mesh.position.z

    // Update goblinBox position to current vertex
    goblinBox.position = new Goblin.Vector3(vert.x, vert.y, vert.z)
    goblinBox.updateDerived()

    // Look for collisions in nearby area using octree search
    const searchResults = octree.search(new THREE.Vector3(vert.x, vert.y, vert.z), 8)
    let noCollisions = true
    for (let j=0; j < searchResults.length; j++) {
      const collidee = addedBlocks[searchResults[j].object.id]
      const contact = Goblin.GjkEpa.testCollision(goblinBox, collidee)

      if (contact !== undefined) {
        noCollisions = false
        break
      }
    }

    if (noCollisions || addedBlocks.length === 0) {
      addNewBox(vert)
    }
  }
}

async function init() {
  initGlobalLights()

  const membraneDimensions = {
    x: 100,
    y: 100,
    thickness: 4,
    padding: 0,
  }

  const { x, y, thickness, padding } = membraneDimensions

  initMembrane(x + padding, y + padding, thickness, false)

  octree = new THREE.Octree({scene: null})

  console.time('goblinFill')
  fillWithGoblin(topLayer)
  console.timeEnd('goblinFill')
}

init()

// ===========================================================================

// window.capturer = new CCapture( { format: 'png' } )

const clock = new THREE.Clock()

const stats = createStats()
const render = () => {
  stats.begin()

  // const delta = clock.getDelta()
  // updateBox(delta, {maxX: 50, minX: -50, maxZ: 50, minZ: -50})

  // for (let keyframe of keyframes) {
  //   keyframe()
  // }

  // for (let lod of lods) {
  //   lod.update(camera)
  // }

  // controls.update(delta*0.1)
  renderer.render(scene, camera)
  // octree.update()
  // capturer.capture(renderer.domElement)

  stats.end()

  requestAnimationFrame(render)
}

render()
