import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js";

!(function (document, window, THREE) {
    var last = window.onload;
    var settings = { width: 550, height: 550 };
    var left = { width: 100, height: 100 };

    var canvas = document.getElementById("product-canvas");
    var initialCanvas = document.getElementById("initial-canvas");
    var frontCanvas = document.getElementById("front-canvas");
    var backCanvas = document.getElementById("back-canvas");
    var topCanvas = document.getElementById("top-canvas");
    var bottomCanvas = document.getElementById("bottom-canvas");

    var main;
    var moveCamera = new THREE.Vector3(0, 0, 0);
    var canMoveCamera = false;

    var last = window.onload;
    window.onload = function () {
        main = renderOn(canvas, settings, 10, 8, 14, false);
        renderOn(initialCanvas, left, 10, 8, 14, true, null, true);
        renderOn(frontCanvas, left, 0, 10, 16, true, null, true);
        renderOn(backCanvas, left, 0, 10, -16, true, null, true);
        renderOn(topCanvas, left, 0, 20, 0, true, null, true);
        renderOn(
            bottomCanvas,
            left,
            0,
            -10,
            0,
            true,
            function () {
                setTimeout(function () {
                    last();
                }, 200);
            },
            true
        );
        main.controls.update();
        window.GlobalCanvas = main;
    };

    function renderOn(
        canvas,
        settings,
        x,
        y,
        z,
        isStatic = true,
        execute = null,
        hasOnclick = false
    ) {
        var instance = {
            scene: null,
            camera: null,
            renderer: null,
            controls: null,
            animations: null,
        };

        var animateRange = null;
        var Animations = new Array();
        var animationMixer = new THREE.AnimationMixer();
        if (!isStatic) {
            animateRange = document.querySelector("#animationRange");
            animateRange.setAttribute("min", 0);
            animateRange.setAttribute("max", 100);
            animateRange.setAttribute("step", 0.01);
            animateRange.setAttribute("value", 0);
            window.clock = 0;
        }

        let align = 3;

        const Scene = new THREE.Scene();
        Scene.background = new THREE.Color("#eeeeee");

        const Camera = new THREE.PerspectiveCamera(55, settings.width / settings.height, 0.1, 1000);
        Camera.position.set(x, y, z);
        Camera.lookAt(0, align, 0);

        const Renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        Renderer.shadowMap.enabled = true;
        Renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        Renderer.setSize(settings.width, settings.height);
        Renderer.setPixelRatio(window.devicePixelRatio);
        Renderer.render(Scene, Camera);
        Renderer.toneMapping = THREE.ACESFilmicToneMapping;
        Renderer.toneMappingExposure = 1;
        Renderer.outputEncoding = THREE.sRGBEncoding;

        var interact = null;
        var Controls = null;
        if (!isStatic) {
            Controls = new OrbitControls(Camera, Renderer.domElement);
            Controls.target.set(0, 3, 0);
            Controls.enableDamping = true;
            Controls.listenToKeyEvents(canvas);

            canvas.onclick = function () {
                canMoveCamera = false;
            };
        }

        const loader = new GLTFLoader();
        loader.load(
            "./renders/workBenchM.gltf",
            (gltf) => {
                Scene.add(gltf.scene);

                gltf.scene.traverse(function (object) {});

                if (!isStatic) {
                    animationMixer = new THREE.AnimationMixer(gltf.scene);
                    Animations.push(
                        animationMixer.clipAction(
                            THREE.AnimationClip.findByName(gltf.animations, "benchExtendAction")
                        )
                    );
                    Animations.push(
                        animationMixer.clipAction(
                            THREE.AnimationClip.findByName(gltf.animations, "doorAction")
                        )
                    );
                    Animations.push(
                        animationMixer.clipAction(
                            THREE.AnimationClip.findByName(gltf.animations, "door1Action")
                        )
                    );
                    Animations.push(
                        animationMixer.clipAction(
                            THREE.AnimationClip.findByName(gltf.animations, "legExtend1Action")
                        )
                    );

                    if (!isStatic) {
                        var max = 0;
                        for (let i = 0; i < Animations.length; i++) {
                            Animations[i].play();
                            Animations[i].paused = false;
                            if (Animations[i]._clip.duration > max) {
                                max = Animations[i]._clip.duration;
                            }
                        }

                        console.log(max);
                        animateRange.setAttribute("max", max - 0.01);
                    }
                }
            },
            (xhr) => {
                console.log(Number((xhr.loaded / xhr.total) * 100).toFixed(0) + "% loaded");
                if (xhr.loaded >= xhr.total && execute != null) {
                    execute();
                }
            },
            (error) => {
                console.error(error);
            }
        );

        var sun = new THREE.AmbientLight(0xffffff, 2);
        sun.position.set(0, 0, 0);
        Scene.add(sun);

        function makeRender() {
            Renderer.render(Scene, Camera);
        }

        function animate() {
            makeRender();

            if (!isStatic) {
                if (canMoveCamera) {
                    Camera.position.lerp(moveCamera, 0.05);
                }
                Controls.update();

                if (animationMixer) {
                    animationMixer.setTime(window.clock);
                }
            }
            requestAnimationFrame(animate);
        }

        animate();

        if (hasOnclick) {
            canvas.onclick = function () {
                canMoveCamera = true;
                moveCamera.set(x, y, z);
                // Camera.position.set(x, y, z);
                console.log(`Camera position to: (${x} , ${y}, ${z})`);
            };
        }

        if (!isStatic) {
            animateRange.oninput = function () {
                let v = this.value;
                console.log(v);
                window.clock = v;
            };
        }

        instance.camera = Camera;
        instance.controls = Controls;
        instance.renderer = Renderer;
        instance.scene = Scene;
        instance.animations = Animations;

        return instance;
    }
})(document, window, THREE);
