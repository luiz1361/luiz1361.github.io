let codes = document.querySelectorAll('.highlight > pre > code');
let countID = 0;
codes.forEach((code) => {

  code.setAttribute("id", "code" + countID);
  
  let btn = document.createElement('button');
  btn.innerHTML = "C";
  btn.className = "btn-copy";
  btn.setAttribute("data-clipboard-action", "copy");
  btn.setAttribute("data-clipboard-target", "#code" + countID);
  
  let div = document.createElement('div');
  div.appendChild(btn);
  
  code.before(div);

  countID++;
}); 

//let clipboard = new ClipboardJS('.btn-copy');

// Tooltip

$('button').tooltip({
  trigger: 'click',
  placement: 'bottom'
});

function setTooltip(btn, message) {
  $(btn).tooltip('hide')
    .attr('data-original-title', message)
    .tooltip('show');
}

function hideTooltip(btn) {
  setTimeout(function() {
    $(btn).tooltip('hide');
  }, 1000);
}

// Clipboard

var clipboard = new Clipboard('button');

clipboard.on('success', function(e) {
  setTooltip(e.trigger, 'Copied!');
  hideTooltip(e.trigger);
});

clipboard.on('error', function(e) {
  setTooltip(e.trigger, 'Failed!');
  hideTooltip(e.trigger);
});
