(function () {
  var run, evaller;
  run = document.getElementById('run');

  nativeEval = () => {
    prefix = 'native';
    subprefix = '      ';
    try {
      eval('"use strict";' + editor.getValue());
      flush();
    } catch (e) {
      log = '';
      console.error(e.message);
    }
  };
  evaluator = nativeEval;

  evaller = document.getElementById('use-traceur');
  evaller.checked = false;
  evaller.disabled = false;
  evaller.addEventListener('change', function () {
    if (this.checked) {
      evaluator = traceurEval;
    } else {
      evaluator = nativeEval;
    }
  });
}());
