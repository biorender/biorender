import bpy

from blenderDecorators import objectMode

@objectMode
def subsurf(level, render_levels=-1, apply=True):
    if render_levels == -1:
        render_levels = level

    bpy.ops.object.modifier_add(type='SUBSURF')
    bpy.context.object.modifiers['Subsurf'].levels = level
    bpy.context.object.modifiers['Subsurf'].render_levels = render_levels

    if apply:
        bpy.ops.object.modifier_apply(apply_as='DATA', modifier='Subsurf')

@objectMode
def solidify(offset, thickness, use_rim=True, use_rim_only=False):
    bpy.ops.object.modifier_add(type='SOLIDIFY')
    bpy.context.object.modifiers['Solidify'].offset = offset
    bpy.context.object.modifiers['Solidify'].thickness = thickness
    bpy.context.object.modifiers['Solidify'].use_rim = use_rim
    bpy.context.object.modifiers['Solidify'].use_rim_only = use_rim_only
    bpy.ops.object.modifier_apply(apply_as='DATA', modifier='Solidify')

@objectMode
def corrective_smooth(factor, iterations, use_only_smooth):
    bpy.ops.object.modifier_add(type='CORRECTIVE_SMOOTH')
    bpy.context.object.modifiers['CorrectiveSmooth'].use_only_smooth = use_only_smooth
    bpy.context.object.modifiers['CorrectiveSmooth'].iterations = iterations
    bpy.ops.object.modifier_apply(apply_as='DATA', modifier='CorrectiveSmooth')

@objectMode
def laplacian_smooth(lambda_factor):
    bpy.ops.object.modifier_add(type='LAPLACIANSMOOTH')
    bpy.context.object.modifiers['Laplacian Smooth'].lambda_factor = lambda_factor
    bpy.ops.object.modifier_apply(apply_as='DATA', modifier='Laplacian Smooth')

@objectMode
def boolean(targetObj, operation):
    bpy.ops.object.modifier_add(type='BOOLEAN')
    bpy.context.object.modifiers['Boolean'].object = targetObj
    bpy.context.object.modifiers['Boolean'].operation = operation
    bpy.ops.object.modifier_apply(apply_as='DATA', modifier='Boolean')
