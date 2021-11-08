var scene = new THREE.Scene()
scene.background = new THREE.Color(0xCFBDA6)
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 )
var renderer = new THREE.WebGLRenderer()
var controls = new THREE.OrbitControls(camera, renderer.domElement)

var axes = new THREE.AxesHelper(10)
scene.add(axes)
var grid = new THREE.GridHelper()
scene.add(grid)

renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.8
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.shadowMap.enabled = true
document.body.appendChild( renderer.domElement )

camera.position.x = -5
camera.position.y = 8
camera.position.z = 13
camera.lookAt(0,2,0)

new THREE.GLTFLoader().load(
    'models/workBench.gltf',
    function ( gltf ) {
    scene.add( gltf.scene )

    scene.traverse( function(x) {
        if (x.isMesh) {
            x.castShadow = true
            x.receiveShadow = true			
        }

    })
}
)

addLights()
animate()

function animate() {
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
}

function addLights(){
    var hemilight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4)
    scene.add(hemilight)

    var spotLight = new THREE.SpotLight(0xFFA95C, 4)
    spotLight.castShadow = true
    scene.add(spotLight)  
}

