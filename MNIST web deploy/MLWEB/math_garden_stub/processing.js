var model;
async function loadModel() {
  model = await tf.loadGraphModel("TFJS/model.json");
}
loadModel();
nextQuestion();
function predictImage() {
  //console.log("Processing...");

  let image = cv.imread(canvas);
  cv.cvtColor(image, image, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(image, image, 175, 255, cv.THRESH_BINARY);

  //finding contours
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );
  //finding bounding rectangle and cropping
  let cnt = contours.get(0);
  let rect = cv.boundingRect(cnt);
  image = image.roi(rect);

  //scale 20*scaled  || scaled*20
  var height = image.rows;
  var width = image.cols;
  if (height > width) {
    height = 20;
    const scalefactor = image.rows / 20;
    width = Math.round(image.cols / scalefactor);
  } else {
    width = 20;
    const scalefactor = image.cols / 20;
    height = Math.round(image.rows / scalefactor);
  }
  let newSize = new cv.Size(width, height);
  cv.resize(image, image, newSize, 0, 0, cv.INTER_AREA);

  //add padding 28*28
  const LEFT = Math.ceil(4 + (20 - width) / 2);
  const RIGHT = Math.floor(4 + (20 - width) / 2);
  const TOP = Math.ceil(4 + (20 - height) / 2);
  const BOTTOM = Math.floor(4 + (20 - height) / 2);

  const BLACK = new cv.Scalar(0, 0, 0, 0);
  cv.copyMakeBorder(
    image,
    image,
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
    cv.BORDER_CONSTANT,
    BLACK
  );
  //find COM
  cv.findContours(
    image,
    contours,
    hierarchy,
    cv.RETR_CCOMP,
    cv.CHAIN_APPROX_SIMPLE
  );
  cnt = contours.get(0);
  const Moments = cv.moments(cnt, false);

  const cx = Moments.m10 / Moments.m00;
  const cy = Moments.m01 / Moments.m00;

  //Shift IMG with COM
  const X_SHIFT = Math.round(image.cols / 2.0 - cx);
  const Y_SHIFT = Math.round(image.rows / 2.0 - cy);
  newSize = new cv.Size(image.cols, image.rows);
  const M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
  cv.warpAffine(
    image,
    image,
    M,
    newSize,
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    BLACK
  );

  //Normalisation
  let pixelValues = image.data;
  //console.log(pixelValues);
  pixelValues = Float32Array.from(pixelValues);
  pixelValues = pixelValues.map(division);
  function division(num) {
    return num / 255;
  }
 // console.log(pixelValues);

 //Tensor
  const X = tf.tensor([pixelValues]);
  //console.log(`Shape of tensor: ${X.shape}`);
  //console.log(`dtype of tensor: ${X.dtype}`);
  const result = model.predict(X);
  result.print();
  const output = result.dataSync()[0];
  //console.log(tf.memory());

  // //TEST
  // const outputCanvas = document.createElement("CANVAS");
  // cv.imshow(outputCanvas, image);
  // document.body.appendChild(outputCanvas);
  // console.log(image);
  
  //Cleanup
  image.delete();
  contours.delete();
  cnt.delete();
  hierarchy.delete();
  M.delete();
  X.dispose();
  result.dispose();

  return output;
}
