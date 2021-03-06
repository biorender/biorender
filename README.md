# BioRender

Biorender can take 3D models (such as the model of a mitochondrion), which have vertex groups describing protein localization zones, and properly attach transmembrane proteins in their proper orientation. On the roadmap is plans to expand it to support yaml based configuration and so that Geno Ontology descriptions (under biological structures root) can be automatically constructed into 3D scenes. Ultimately, biorender is a tool for creating and sharing 3D interactive visualizations of biochemical scenes. See the [presentation](https://github.com/biorender/biorender/releases/download/v0.1.0/biorender-torbug-2016-04-27.pdf) given at TorBUG on April 27 for more info.

Thanks for [Smart Biology](https://www.smart-biology.com/) for providing several models and resources!
- ATP Synthase
- phosholipid bilayer texture

## Abstract

Cellular processes are difficult to understand as illustrations, and animations are limited in their capacity to provide students with the oppurtunity to investigate questions through direct interaction. BioRender is a WebGL based engine for creating properly scaled cell models accessible from any modern web browser. Large components such as the mitochondria are procedurally generated and then [populated](https://github.com/biorender/biorender/issues/26) using PDB models. BioRender aims to lower the barrier to entry to understanding biology by providing a platform for real-time interaction with cellular structures and biochemical processes.

*WIP screen*
<img width="1093" alt="screen shot 2016-04-23 at 4 18 05 pm" src="https://cloud.githubusercontent.com/assets/1270998/14763784/100a49c8-096f-11e6-8f50-28987be4daeb.png">

## API

*In development*

## Alpha Software Goals

* see cell from outside
* see nucleus
* zoom into mitochondria
* use Blender file for ATP Synthase
* animate functioning of enzyme
    * rotor
    * top static
    * conformational changes
    * hydrogens entering/leaving
* within pinched phospholipid bilayer

Some resources/inspiration:
* [Powering the Cell: Mitochondria](https://www.youtube.com/watch?v=RrS2uROUjK4)
* [Molecular animation of ATP synthase](https://www.youtube.com/watch?v=GM9buhWJjlA)

### Interactivity Exercises

* take apart dimer -> fall apart
* potential concentration change
* TBD
