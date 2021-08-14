import {
  Engine,
  Scene,
  Vector3,
  ArcRotateCamera,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Color4,
} from "@babylonjs/core";
import {
  AdvancedDynamicTexture,
  Button,
  Control
} from "@babylonjs/gui";
import { GameState } from '../store';


const renderStartScene = async (canvas: HTMLCanvasElement, engine: Engine, currentScene: Scene, renderNextScene: () => Promise<void>): Promise<any> => {
  console.log('Start Scene rendering...');

  engine.displayLoadingUI(); // Display loading UI while the start scene loads
  currentScene.detachControl(); // Detach all event handlers from the current scene

  // --- SCENE SETUP ---
  const startScene = new Scene(engine);
  startScene.clearColor = new Color4(0, 0, 0, 1); // Define the color used to clear the render buffer

  // Initialize Camera
  const camera: ArcRotateCamera = new ArcRotateCamera(
    'camera',
    Math.PI / 3,
    Math.PI / 2.5,
    3,
    Vector3.Zero(),
    startScene
  );
  camera.attachControl(canvas, true);

  // Initialize Light
  const light: HemisphericLight = new HemisphericLight(
    'light1',
    new Vector3(0.8, 1, 0),
    startScene
  );

  // Create Mesh
  const box: Mesh = MeshBuilder.CreateBox(
    'box',
    {},
    startScene
  );

  // --- GUI ---
  const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('UI');
  guiMenu.idealWidth = window.innerWidth;
  guiMenu.idealHeight = window.innerHeight;
  console.log('GUI Menu Ideal Height: ', guiMenu.idealHeight);

  // Create a simple button to go to the next scene
  const button = Button.CreateSimpleButton('start', 'PLAY GAME');
  button.width = 0.4;
  button.height = 0.07;
  button.color = '#ffffff';
  button.top = '-10px';
  button.thickness = 0.5;
  button.hoverCursor = 'pointer';
  button.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  guiMenu.addControl(button);

  button.onPointerClickObservable.add(() => {
    renderNextScene();
    startScene.detachControl(); // Disable observables
  })

  // --- START SCENE IS LOADED ---
  await startScene.whenReadyAsync(); // 'whenReadyAsync' returns a promise that resolves when scene is ready
  engine.hideLoadingUI(); // hide the loading UI after scene has loaded
  currentScene.dispose(); // Release all resources held by the existing scene

  return {
    scene: startScene,
    state: GameState.START
  }
}

export default renderStartScene;