var i, editor, log, flush, prefix, traceurEval, _log, forms, subprefix;
(function () {
  forms = document.getElementsByTagName('form')
  for (i = 0; i < forms.length; i += 1) {
    forms[i].addEventListener('submit', function (e) {
      e.preventDefault();
    });
  }

  function saveHandler(e) {
    e.preventDefault();
    document.getElementById('run').click();
  }

  editor = ace.edit('editor');
  editor.setTheme('ace/theme/twilight');
  editor.getSession().setTabSize(2);
  editor.getSession().setMode('ace/mode/javascript');

  editor.container.getElementsByTagName('textarea')[0].addEventListener('keydown', function (e) {
    if (e.which === 83 && (e.metaKey || e.ctrlKey)) {
      saveHandler(e);
    }
  });

  log = '';
  _log = console.log;
  console.log = function (t) {
    var a = [], i;
    if (document.getElementById('use-console').checked) {
      _log.apply(console, arguments);
    }
    if (arguments.length >= 1) {
      t = Array.prototype.slice.apply(arguments);
      for (i = 0; i < t.length; i += 1) {
        if (typeof t[i] === 'function') {
          a.push(t[i].toString());
        } else {
          a.push(JSON.stringify(t[i]));
        }
      }
      t = a.join('<br> ' + subprefix + ' > ');
    }
    log += '<pre>[' + prefix + ']&gt; ' + t.toString() + '</pre>';
  };
  flush = function () {
    var c = document.getElementById('console');
    c.innerHTML += log;
    log = '';
  };

  console.error = function (t) {
    var c = document.getElementById('console');
    c.innerHTML += '<pre class="error">[' + prefix + ']&gt; ' + t.toString() + '</pre>';
  };

  Mousetrap.bind([ 'ctrl+s', 'command+s' ], saveHandler);
  traceur.options.experimental = true;

  document
    .getElementById('run')
    .addEventListener('click', traceurEval = function () {
      prefix = 'traceur';
      subprefix = '       ';
      var c, options;
      c = editor.getValue();
      options = {
        address: 'foo',
        name: 'foo',
        referrer: window.location.href,
        traceurOptions: traceur.options
      };
      try {
        System.module(c, options).then(function (m) {
          flush();
        });
      } catch (e) {
        log = '';
        console.error(e.message);
      }
    });
}());