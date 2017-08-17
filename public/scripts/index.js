const isValidExternalURL = (str) => {
  const a  = document.createElement('a');
  a.href = str;
  return (a.host && a.host != window.location.host);
};

const edgesFactory = (soonToBeNodes, startId) => {
  return soonToBeNodes.map((value, index) => {
    return {from: startId, to: index + 2, color: {color: '#97C2FC'}};
  });
};

const main = () => {
  let subject;
  let currentElementId = 1;
  const noArrayLinkedData = [];
  const arrayLinkedData = [];
  $('#mynetwork').hide();

  $.get('https://swapi.co/api/people/1').then((data) => {
    subject = data.name;
    toPairs(data).forEach(([name, value]) => {
      if (isValidExternalURL(value) && name !== 'url' && !Array.isArray(value)) {
        $.get(value).then((data) => {
          noArrayLinkedData.push(data.name);
        });
      } else if (Array.isArray(value) && value.length === 1 && isValidExternalURL(value[0])) {
        $.get(value).then((data) => {
          arrayLinkedData.push(data.name);
        });
      } else if (Array.isArray(value) && value.length < 5) {
        value.forEach((maybeAURL) => {
          if ( isValidExternalURL(maybeAURL) ) {
            $.get(maybeAURL).then((data) => {
              arrayLinkedData.push(data.name);
            });
          }
        });
      }
    });
  });

  setTimeout(() => {
    const soonToBeNodes = [];
    const basicShape = {shape: 'box', color:'#97C2FC'};
    let idCount = currentElementId;

    soonToBeNodes.push(Object.assign({}, basicShape, {id: idCount, label: subject}));
    idCount++;
    noArrayLinkedData.forEach((name) => {
      soonToBeNodes.push(Object.assign({}, basicShape, {id: idCount, label: name}));
      idCount++;
    });
    arrayLinkedData.forEach((name) => {
      soonToBeNodes.push(Object.assign({}, basicShape, {id: idCount, label: name}));
      idCount++;
    });

    const nodes = new vis.DataSet(soonToBeNodes);
    const edges = new vis.DataSet(edgesFactory(soonToBeNodes, 1));
    var container = document.getElementById('mynetwork');
    var data = {
      nodes: nodes,
      edges: edges
    };
    var options = {
      nodes: {
        shape: 'circle'
      }
    };
    var network = new vis.Network(container, data, options);
    $('#mynetwork').show();
    $('.loading').hide();
  }, 10000);
};

document.addEventListener("DOMContentLoaded", main);
