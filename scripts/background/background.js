import { out5, canvasCtx5 } from '../workout/workout.js'

//getting the virtual bg img reference
const bgImage = document.getElementById('virtual_background');

function onResults(results) {
  //save the blank state
  canvasCtx5.save();
  canvasCtx5.drawImage(results.image, 0, 0, out5.width, out5.height);

  // make all pixels other than face and body transparent
  canvasCtx5.globalCompositeOperation = 'destination-atop';
  canvasCtx5.drawImage(results.segmentationMask, 0, 0, out5.width, out5.height);

  //set our background image as background
  canvasCtx5.globalCompositeOperation = 'destination-over';
  canvasCtx5.drawImage(bgImage, 0, 0, out5.width, out5.height);

  //restore the canvas blank state
  canvasCtx5.restore();
}

export const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
  },
});
selfieSegmentation.setOptions({
  modelSelection: 1,
  selfieMode: true,
});
selfieSegmentation.onResults(onResults);
