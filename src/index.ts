type Axis = 'x' | 'y';

window.addEventListener('load', function() {
  const file = document.getElementById('file');

  if (file) {
    file.addEventListener('change', ({ target }): void => {
      const files = (target as HTMLInputElement).files;
      if (!files) {
        //TODO: show error message
        return;
      }

      handleFileChange(files);
    });
  }
});

const axes: Axis[] = ['x', 'y'];
const factorRange = [0.75, 1.25];

const getRandomAxis = (axes: Axis[]): Axis =>
  axes[Math.floor(Math.random() * axes.length)];

const getRandomFactor = (range: number[]): number =>
  (Math.floor(Math.random() * (range[1] * 100 - range[0] * 100)) +
    range[0] * 100) /
  100;

const handleFileChange = (files: FileList) => {
  const fileName = files && files[0].name;

  const reader = new FileReader();
  reader.readAsDataURL(files[0]);
  reader.onload = () => {
    const result = reader.result;

    if (typeof result !== 'string') {
      //TODO: show error message
      return;
    }

    const img = new Image();
    img.src = result;
    img.onload = () => {
      const axis = getRandomAxis(axes);
      const factor = getRandomFactor(factorRange);
      const width = axis === 'x' ? img.width * factor : img.width;
      const height = axis === 'y' ? img.height * factor : img.height;

      const canvas = <HTMLCanvasElement>document.getElementById('canvas');

      if (!canvas) {
        //TODO: show error message
        return;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        //TODO: show error message
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      ctx.canvas.toBlob(
        blob => {
          if (!blob) {
            //TODO: show error message
            return;
          }
          const file = new File([blob], fileName, {
            type: 'image/png',
            lastModified: Date.now(),
          });
        },
        'image/png',
        1,
      );
    };
  };
};
