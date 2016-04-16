import bpy
import bmesh
import imp
from mathutils import Vector

# Blender utils
from blenderutils import setMode, delete_all_meshes
# imp.reload(blenderutils)

# Decorators
import blenderDecorators
imp.reload(blenderDecorators)
from blenderDecorators import startClean


# Mesh geometries
# All geometry methods return the object created
import geom
imp.reload(geom)

# Edit mode operators
import edit
imp.reload(edit)

# Modifiers
import modifiers

# Materials
from materials import makeMaterial, setMaterial

# === CONSTANTS ===

# Used in getFaceEdgeMap, getPolygonByNormal
# INDEX_OF = 0
# REF_TO = 1

# === FUNCTIONS ===

# Define as variables which values come from obj.data at the top of each scope
# where they are required.

# Always return a previosuly assigned variable, not a statement to execute.
# Except if you are in a loop and its faster to break out once you find what
# you need.

def getFaceEdgeMap(obj):
    edges = obj.data.edges
    edge_keys = obj.data.edge_keys

    face_edge_map = {ek: edges[i] for i, ek in enumerate(edge_keys)}

    return face_edge_map

# TODO check if normal is actually normal, throw error
def getPolygonByNormal(obj, normal):
    polygons = obj.data.polygons

    for polygon in polygons:
        if polygon.normal == normal:
            return polygon

def getEdgeForFaceAtIndex(obj, face, index):
    face_edge_map = getFaceEdgeMap(obj)
    edge_keys = face.edge_keys

    for i, ek in enumerate(edge_keys):
        edge = face_edge_map[ek]

        if i == index:
            return edge

# === START ===

cristae_disc_loop_cut_scale_val = 2.5

@startClean
def main():
    cristae = geom.box(scale=(0.1, 1, 1), name='Cristae')

    face = getPolygonByNormal(cristae, Vector((1, 0, 0)))

    edit.loop_cut(getEdgeForFaceAtIndex(cristae, face, 0).index, 2)
    bpy.ops.transform.resize(value=(1, cristae_disc_loop_cut_scale_val, 1))

    edit.loop_cut(getEdgeForFaceAtIndex(cristae, face, 1).index, 2)
    bpy.ops.transform.resize(value=(1, 1, cristae_disc_loop_cut_scale_val))

    modifiers.subsurf(4)

    baseMat = makeMaterial('Cristae.Base', (1,1,1), (1,1,1), 1)
    setMaterial(cristae, baseMat)

    setMode('EDIT')

    mesh = bmesh.from_edit_mesh(cristae.data)
    v_indexes = []

    for v in mesh.verts:
        if v.co[1] < -0.9:
            v_indexes.append(v.index)

    setMode('OBJECT')
    curved_vg = cristae.vertex_groups.new('Curved')
    curved_vg.add(v_indexes, 1.0, 'REPLACE')

    red = makeMaterial('Red', (1,0,0), (1,1,1), 1)
    setMaterial(cristae, red)

    for i, mat in enumerate(cristae.material_slots):
        print(mat.name)

    # bpy.context.object.active_material_index = 1

    # bpy.ops.object.material_slot_add()
    # obj = bpy.context.object
    # obj.material_slots[obj.material_slots.__len__() - 1].material = red

    # bpy.ops.object.vertex_group_set_active(group='Curved')

main()
