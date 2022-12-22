import React, { useState, useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MediaRendererProps } from "./MediaRenderer";
import { mergeRefs } from "../utils/react";

const ThreeRenderer = React.forwardRef<HTMLDivElement, MediaRendererProps> (
  ({ src, alt, poster, style, ...restProps }, ref) => {
    const refContainer = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45,1, 1, 20);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();

    const makeScene = (width:number, height:number): void => { 
      const light = new THREE.AmbientLight( 0x404040 );
      scene.add(camera);        
      scene.add(light);
      renderer.setSize(width, height);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.setPixelRatio(window.devicePixelRatio);
      refContainer.current?.appendChild(renderer.domElement);
    }
    
    const animate = () => {
      requestAnimationFrame( animate );
      controls.update();
      renderer.render( scene, camera );
    }

    const loadModel = (src: string) => {
      const loader = new GLTFLoader();

      loader.load(
          src, 
          model => {
              scene.add(model.scene);
              camera.position.z = 5;
              animate();
              setLoading(false);
          },
      )
    }

    useEffect(() => {
      let {current} = refContainer;
      if (current) {
          makeScene(current.clientWidth, current.clientHeight);
          loadModel(src || '');
      }
  },[])

    return (  
      <div
      style={style}
      ref={mergeRefs([refContainer, ref])}
      >
      {loading && (
          <span style={{ position: "absolute", left: "50%", top: "50%" }}>
          Loading...
          </span>
      )}
      </div>
     );
  })

export default ThreeRenderer