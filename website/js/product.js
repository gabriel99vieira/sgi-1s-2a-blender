// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

!(function (document, window) {
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
        renderOn(frontCanvas, left, 0, 8, 14, true, null, true);
        renderOn(backCanvas, left, 0, 8, -14, true, null, true);
        renderOn(topCanvas, left, 0, 18, 0, true, null, true);
        renderOn(
            bottomCanvas,
            left,
            0,
            -10,
            0,
            true,
            function () {
                last();
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
        };

        var GLTFAnimations = new Array();
        var Animations = new Array();

        let align = 3;

        const Scene = new THREE.Scene();
        Scene.background = new THREE.Color("white");

        const Camera = new THREE.PerspectiveCamera(55, settings.width / settings.height, 0.1, 1000);
        Camera.position.set(x, y, z);
        Camera.lookAt(0, align, 0);

        const Renderer = new THREE.WebGLRenderer({ canvas: canvas });
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
            Controls = new THREE.OrbitControls(Camera, Renderer.domElement);
            Controls.target.set(0, 0, 0);
            Controls.enableDamping = true;
            Controls.listenToKeyEvents(canvas);

            // canvas.onmousemove = function () {
            //     canMoveCamera = false;
            // };
            canvas.onclick = function () {
                canMoveCamera = false;
            };
        }

        // const Axes = new THREE.AxesHelper();
        // Scene.add(Axes);

        // const Grid = new THREE.GridHelper();
        // Scene.add(Grid);

        const loader = new THREE.GLTFLoader();
        loader.load(
            "./renders/workBenchM.gltf",
            (gltf) => {
                // console.log(gltf);
                Scene.add(gltf.scene);
                // animationMixer = new THREE.AnimationMixer(gltf.scene);

                gltf.scene.traverse(function (object) {});

                // GLTFAnimations = gltf.animations;

                // Animations.push(
                //     animationMixer.clipAction(THREE.AnimationClip.findByName(gltf.animations, "Wind"))
                // );
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

        var animationMixer = new THREE.AnimationMixer();
        var clock = new THREE.Clock();

        var sun = new THREE.AmbientLight(0xffffff, 2);
        sun.position.set(0, 0, 0);
        Scene.add(sun);

        function makeRender() {
            Renderer.render(Scene, Camera);
        }

        function animate() {
            requestAnimationFrame(animate);

            makeRender();

            if (!isStatic) {
                if (canMoveCamera) {
                    console.log("Moving camera");
                    Camera.position.lerp(moveCamera, 0.02);
                }
                Controls.update();
            }
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

        instance.camera = Camera;
        instance.controls = Controls;
        instance.renderer = Renderer;
        instance.scene = Scene;

        return instance;
    }
})(document, window);
