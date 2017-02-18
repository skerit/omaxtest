var VideoDecode,
    VideoRender,
    Canvas = require('openvg-canvas'),
    canvas,
    pdata,
    ctx,
    img,
    omx = require('openmax'),
    fs = require('fs'),
    ws = require('stream').Writable(),
    vg = require('openvg');

console.log('Creating OMX decoders');

VideoDecode = new omx.VideoDecode();
VideoRender = new omx.VideoRender();

console.log('Creating new canvas');
canvas = new Canvas(1920, 1080);

console.log('Getting 2D context');
ctx = canvas.getContext('2d');

console.log('Getting image data');
img = ctx.getImageData(0, 0, 1920, 1080);

console.log('Got image data:', !!img.data);
pdata = img.data;

var max = 1920 * 1080 * 4,
    i = 0,
    x = 0;

ctx.imageSmoothingEnabled = false;

console.time('Draw 1 frame');

ws._write = function (data, enc, next) {

	var ab = data.buffer.slice(0, 0 + data.length),
	    ar = new Uint8Array(ab);

	// An image format needs to be defined.
	// The output of openmax is a raw decoded video stream,
	// I have no idea how to correctly output it yet, it's a miracle it gets as
	// far as it does (it segfaults after a few seconds, but it proofs it works!)

	// Get the 'VG_sRGBX_8888' constants from here:
	// (Use the ones starting with uppercase VG, not lowercase vg!)
	// http://hackage.haskell.org/package/OpenVG-0.1/src/src/Graphics/Rendering/OpenVG/VG/Constants.hsc

	vg.writePixels(ar, 1920*3, vg.VGImageFormat.VG_sRGBA_8888_PRE, 0, 0, 1920, 1080);
	canvas.vgSwapBuffers();

	next();

	if (data.onBufferDone) {
		data.onBufferDone();
	}

	return;

	// This is the 'canvas' way to write the video to the screen,
	// but because it has to loop over the buffer it's insanely slow

	console.time('Loop over data');

	// Each loop takes about 300ms!!
	// That's insanely slow and gives a framerate of 3fps
	for (var j = 0; j < data.length; j++) {

		if (x === 3) {
			//pdata[i] = 255;
			i++;
			x = 1;
		} else {
			x++;
		}

		if (i >= max) {
			i = 0;

			// +/- 26ms
			ctx.putImageData(img, 0, 0);

			// +/- 0.07ms
			canvas.vgSwapBuffers();
		}

		//pdata[i] = data[j];
		i++;
	}

	console.timeEnd('Loop over data');
};


omx.Component.initAll([VideoDecode, VideoRender]).then(function() {

	// Set decode format
	VideoDecode.setVideoPortFormat(omx.VIDEO_CODINGTYPE.VIDEO_CodingAVC);

	// Decode the file
	fs.createReadStream('video-LQ.h264').pipe(VideoDecode).pipe(ws);
});

