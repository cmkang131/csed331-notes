/* csed331 v6-algo2.js — 알고리즘 인터랙티브 위젯 팩 2
   트레이스는 강의 손계산 표와 대조 검증됨.
   스타일: 흰 배경, 잉크 #1a1a1a, 빨강 #9e2b25 포인트만. */

/* ---- 선택 정렬 (sort-selection) ---- */
V6.register('sort-selection', function (root) {
  var INK = '#1a1a1a', RED = '#9e2b25', GRID = '#e8e6e0';
  var NS = 'http://www.w3.org/2000/svg';

  function h(tag, attrs, parent) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      e.setAttribute(k, attrs[k]);
    });
    if (parent) parent.appendChild(e);
    return e;
  }

  function svgOpen(w, hgt) {
    return '<svg xmlns="' + NS + '" width="' + w + '" height="' + hgt +
      '" style="max-width:none;height:auto;display:block;background:#fff;font-family:\'Noto Sans KR\',sans-serif">';
  }

  function barSvg(arr, hl, labels) {
    var w = arr.length * 44 + 20;
    var max = Math.max.apply(null, arr);
    var unit = 120 / max;
    var s = svgOpen(w, 165);

    for (var i = 0; i < arr.length; i++) {
      var c = (hl && hl[i]) || INK;
      var bh = arr[i] * unit;

      s += '<rect x="' + (12 + i * 44) +
        '" y="' + (140 - bh) +
        '" width="32" height="' + bh +
        '" fill="none" stroke="' + c +
        '" stroke-width="' + (hl && hl[i] ? 2.5 : 1.5) + '"/>';

      s += '<text x="' + (28 + i * 44) +
        '" y="156" font-size="12" text-anchor="middle" fill="' + c + '">' +
        (labels ? labels[i] : arr[i]) + '</text>';
    }

    return s + '</svg>';
  }

  function player(root, titleText, steps) {
    if (window.V6 && V6.title) V6.title(root, titleText);

    var stage = h('div', null, root);
    stage.style.cssText = 'border:1px solid ' + INK +
      ';background:#fff;padding:10px;overflow-x:auto';

    var note = h('div', { 'class': 'v6-note' }, root);
    var bar = h('div', { 'class': 'v6-controls' }, root);

    var prev = h('button', { 'class': 'v6-btn' }, bar);
    prev.textContent = '◀ 이전';

    var pos = h('span', { 'class': 'v6-pos' }, bar);

    var next = h('button', { 'class': 'v6-btn' }, bar);
    next.textContent = '다음 ▶';

    var i = 0;

    function show() {
      stage.innerHTML = steps[i].svg;
      note.innerHTML = steps[i].note;
      pos.textContent = (i + 1) + ' / ' + steps.length;
      prev.disabled = i === 0;
      next.disabled = i === steps.length - 1;
    }

    prev.onclick = function () {
      if (i > 0) {
        i--;
        show();
      }
    };

    next.onclick = function () {
      if (i < steps.length - 1) {
        i++;
        show();
      }
    };

    show();
  }

  var a0 = [7, 3, 9, 2, 8, 4];
  var a = a0.slice();
  var steps = [];

  steps.push({
    note: '보충: 삽입 정렬과 비교하는 선택 정렬 시각화. 강의 슬라이드 직접 근거 미확인. 초기 배열. 미정렬 구간의 최솟값을 찾아 앞 원소와 교환하는 선택 정렬(Selection Sort)을 시작한다.',
    svg: barSvg(a, null)
  });

  for (var i = 0; i < a.length - 1; i++) {
    var min = i;
    var startHL = {};
    startHL[min] = RED;

    steps.push({
      note: 'i = <b>' + i + '</b>. ' +
        (i === 0
          ? '정렬된 앞구간은 아직 없고, 미정렬 구간은 <b>0..' + (a.length - 1) + '</b>다.'
          : '정렬된 앞구간은 0..' + (i - 1) +
            ', 미정렬 구간은 <b>' + i + '..' + (a.length - 1) + '</b>다.') +
        ' 최솟값 탐색을 시작한다. 현재 최솟값(minimum)은 a[' +
        min + '] = <b>' + a[min] + '</b>.',
      svg: barSvg(a, startHL)
    });

    for (var j = i + 1; j < a.length; j++) {
      var oldMin = min;
      var oldVal = a[oldMin];
      var newVal = a[j];
      var isNew = newVal < oldVal;

      if (isNew) min = j;

      var cmpHL = {};
      cmpHL[oldMin] = INK;
      cmpHL[j] = RED;

      steps.push({
        note: 'a[' + j + '] = <b>' + newVal +
          '</b>과 현재 최솟값 a[' + oldMin + '] = <b>' + oldVal +
          '</b>를 비교한다. ' +
          (isNew
            ? '더 작으므로 최솟값 인덱스를 <b>' + min + '</b>으로 갱신한다. ' +
              '<span style="color:' + RED + '">빨강: 갱신된 새 최솟값</span>, ' +
              '잉크 테두리: 직전 최솟값 후보.'
            : '더 작지 않으므로 최솟값을 유지한다. ' +
              '<span style="color:' + RED + '">빨강: 비교 대상</span>, ' +
              '잉크 테두리: 현재 최솟값 후보(유지).'),
        svg: barSvg(a, cmpHL)
      });
    }

    var selected = a[min];
    var displaced = a[i];
    var tmp = a[i];
    a[i] = a[min];
    a[min] = tmp;

    var swapHL = {};
    swapHL[i] = RED;

    steps.push({
      note: '스캔 완료. 최솟값 <b>' + selected +
        '</b>을 위치 ' + i + '로 이동한다.' +
        (min === i
          ? ' 이미 해당 위치가 최솟값이므로 배열은 바뀌지 않는다.'
          : ' a[' + i + ']의 ' + displaced + '와 a[' + min + ']의 ' +
            selected + '를 교환한다.') +
        ' 정렬된 앞구간 0..' + i + '가 확정된다.',
      svg: barSvg(a, swapHL)
    });
  }

  steps.push({
    note: '정렬 완료. 비교 횟수는 입력과 무관하게 항상 n(n−1)/2 = 6·5/2 = <b>15회</b>이며, 교환은 최대 n−1 = <b>5회</b>다. 시간 복잡도는 최선·평균·최악 모두 <b>O(n²)</b>이다. 삽입 정렬은 거의 정렬된 입력에서 O(n)에 가까워질 수 있지만, 선택 정렬의 비교 횟수는 줄어들지 않는다.',
    svg: barSvg(a, null)
  });

  player(root, '선택 정렬 (Selection Sort) — 보충', steps);
});

/* ---- Bellman-Ford (bellman-ford) ---- */
V6.register('bellman-ford', function (root) {
  var INK = '#1a1a1a', RED = '#9e2b25', GRID = '#e8e6e0';
  var NS = 'http://www.w3.org/2000/svg';

  function h(tag, attrs, parent) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      e.setAttribute(k, attrs[k]);
    });
    if (parent) parent.appendChild(e);
    return e;
  }

  function svgOpen(w, hgt) {
    return '<svg xmlns="' + NS + '" width="' + w + '" height="' + hgt +
      '" viewBox="0 0 ' + w + ' ' + hgt +
      '" style="max-width:none;height:auto;display:block;background:#fff;font-family:\'Noto Sans KR\',sans-serif">';
  }

  var nodes = ['A', 'B', 'C', 'D', 'E'];

  var positions = {
    A: { x: 70, y: 150, card: { x: 28, y: 178, w: 80, h: 31 } },
    C: { x: 200, y: 150, card: { x: 116, y: 178, w: 78, h: 31 } },
    B: { x: 330, y: 150, card: { x: 350, y: 178, w: 70, h: 31 } },
    D: { x: 470, y: 70, card: { x: 490, y: 55, w: 68, h: 30 } },
    E: { x: 470, y: 230, card: { x: 490, y: 215, w: 68, h: 30 } }
  };

  var edges = [
    {
      id: 'AB', from: 'A', to: 'B', weight: 4, label: '4',
      d: 'M 87 140 Q 200 72 313 140', lx: 200, ly: 95
    },
    {
      id: 'AC', from: 'A', to: 'C', weight: 2, label: '2',
      d: 'M 88 150 L 182 150', lx: 135, ly: 141
    },
    {
      id: 'BC', from: 'B', to: 'C', weight: -3, label: '−3',
      d: 'M 313 140 Q 265 108 217 140', lx: 265, ly: 111
    },
    {
      id: 'CB', from: 'C', to: 'B', weight: 3, label: '3',
      d: 'M 217 160 Q 265 207 313 160', lx: 265, ly: 204
    },
    {
      id: 'BD', from: 'B', to: 'D', weight: 2, label: '2',
      d: 'M 346 141 L 454 81', lx: 400, ly: 103
    },
    {
      id: 'BE', from: 'B', to: 'E', weight: 3, label: '3',
      d: 'M 346 160 Q 405 150 454 219', lx: 432, ly: 208
    },
    {
      id: 'CD', from: 'C', to: 'D', weight: 3, label: '3',
      d: 'M 216 139 Q 330 5 454 62', lx: 340, ly: 35
    },
    {
      id: 'CE', from: 'C', to: 'E', weight: 4, label: '4',
      d: 'M 216 161 Q 330 295 454 238', lx: 340, ly: 266
    },
    {
      id: 'ED', from: 'E', to: 'D', weight: -2, label: '−2',
      d: 'M 456 213 Q 420 150 456 87', lx: 430, ly: 147
    }
  ];

  /*
   * snapshots[r][v] is the result after synchronous round r.
   * Each round reads only the preceding round's distances.
   */
  var snapshots = [
    {
      A: { dist: '0', prev: '–' },
      B: { dist: '∞', prev: '–' },
      C: { dist: '∞', prev: '–' },
      D: { dist: '∞', prev: '–' },
      E: { dist: '∞', prev: '–' }
    },
    {
      A: { dist: '0', prev: '–' },
      B: { dist: '4', prev: 'A' },
      C: { dist: '2', prev: 'A' },
      D: { dist: '∞', prev: '–' },
      E: { dist: '∞', prev: '–' }
    },
    {
      A: { dist: '0', prev: '–' },
      B: { dist: '4', prev: 'A' },
      C: { dist: '1', prev: 'B' },
      D: { dist: '5', prev: 'C' },
      E: { dist: '6', prev: 'C' }
    },
    {
      A: { dist: '0', prev: '–' },
      B: { dist: '4', prev: 'A' },
      C: { dist: '1', prev: 'B' },
      D: { dist: '4', prev: 'C' },
      E: { dist: '5', prev: 'C' }
    },
    {
      A: { dist: '0', prev: '–' },
      B: { dist: '4', prev: 'A' },
      C: { dist: '1', prev: 'B' },
      D: { dist: '3', prev: 'E' },
      E: { dist: '5', prev: 'C' }
    },
    {
      A: { dist: '0', prev: '–' },
      B: { dist: '4', prev: 'A' },
      C: { dist: '1', prev: 'B' },
      D: { dist: '3', prev: 'E' },
      E: { dist: '5', prev: 'C' }
    }
  ];

  function makeSet(arr) {
    var out = {};
    for (var i = 0; i < arr.length; i++) out[arr[i]] = true;
    return out;
  }

  var treeEdges = makeSet(['AB', 'BC', 'CE', 'ED']);

  function graphSvg(state, changedNodes, causeEdges, finalView) {
    var changed = makeSet(changedNodes);
    var causes = makeSet(causeEdges);
    var s = svgOpen(560, 300);

    s += '<defs>';
    s += '<marker id="arrow-ink" markerWidth="8" markerHeight="8" ' +
      'refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">' +
      '<path d="M0,0 L6,3 L0,6 Z" fill="' + INK + '"/></marker>';
    s += '<marker id="arrow-red" markerWidth="8" markerHeight="8" ' +
      'refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">' +
      '<path d="M0,0 L6,3 L0,6 Z" fill="' + RED + '"/></marker>';
    s += '</defs>';

    s += '<text x="12" y="17" font-size="10" fill="' + INK +
      '">dist(거리) / prev(이전 정점)</text>';
    s += '<text x="285" y="17" font-size="10" fill="' + RED +
      '">빨강: 갱신·원인 간선·음수 간선</text>';

    for (var i = 0; i < edges.length; i++) {
      var e = edges[i];
      var isRed = e.weight < 0 || !!causes[e.id];
      var color = isRed ? RED : INK;
      var isTree = finalView && !!treeEdges[e.id];
      var sw = isTree ? 3.6 : 1.7;

      s += '<path d="' + e.d +
        '" fill="none" stroke="' + color +
        '" stroke-width="' + sw +
        '" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arrow-' +
        (isRed ? 'red' : 'ink') + ')"/>';

      s += '<text x="' + e.lx + '" y="' + e.ly +
        '" text-anchor="middle" font-size="12" font-weight="' +
        (isTree ? '700' : '400') + '" fill="' + color +
        '" style="paint-order:stroke;stroke:#fff;stroke-width:4px;stroke-linejoin:round">' +
        e.label + '</text>';
    }

    var drawOrder = ['A', 'C', 'B', 'D', 'E'];

    for (var j = 0; j < drawOrder.length; j++) {
      var name = drawOrder[j];
      var p = positions[name];
      var nodeColor = changed[name] ? RED : INK;

      s += '<circle cx="' + p.x + '" cy="' + p.y +
        '" r="17" fill="#fff" stroke="' + nodeColor +
        '" stroke-width="' + (changed[name] ? 2.5 : 1.5) + '"/>';

      s += '<text x="' + p.x + '" y="' + (p.y + 4) +
        '" text-anchor="middle" font-size="13" font-weight="700" fill="' +
        nodeColor + '">' + name + '</text>';
    }

    for (var k = 0; k < drawOrder.length; k++) {
      var n = drawOrder[k];
      var pos = positions[n];
      var card = pos.card;
      var val = state[n];
    
  var color = changed[n] ? RED : INK;

      s += '<rect x="' + card.x + '" y="' + card.y +
        '" width="' + card.w + '" height="' + card.h +
        '" rx="0" fill="#fff" stroke="' + color +
        '" stroke-width="' + (changed[n] ? 1.5 : 1) + '"/>';

      var tx = card.x + card.w / 2;

      s += '<text x="' + tx + '" y="' + (card.y + 12) +
        '" text-anchor="middle" font-size="10" fill="' + color +
        '">dist=' + val.dist + '</text>';

      s += '<text x="' + tx + '" y="' + (card.y + 24) +
        '" text-anchor="middle" font-size="10" fill="' + color +
        '">prev=' + val.prev + '</text>';
    }

    return s + '</svg>';
  }

  function tableHTML(lastRound) {
    var cellStyle = 'border:1px solid #1a1a1a;padding:4px 6px;' +
      'text-align:center;color:#1a1a1a;background:#fff;white-space:nowrap;';
    var headerStyle = cellStyle + 'font-weight:700;';

    var s = '<table style="border-collapse:collapse;width:100%;min-width:430px;' +
      'margin-top:10px;font-family:\'Noto Sans KR\',sans-serif;font-size:12px;' +
      'color:#1a1a1a;background:#fff">';

    s += '<caption style="text-align:left;font-size:11.5px;color:#1a1a1a;' +
      'padding:4px 2px">각 라운드의 갱신은 <b>직전 라운드 스냅샷</b>으로 계산(동기식). ' +
      '셀은 dist / prev.</caption>';
    s += '<thead><tr>';
    var headings = ['라운드', 'A', 'B', 'C', 'D', 'E'];

    for (var i = 0; i < headings.length; i++) {
      s += '<th style="' + headerStyle + '">' + headings[i] + '</th>';
    }

    s += '</tr></thead><tbody>';

    for (var r = 0; r <= lastRound; r++) {
      s += '<tr><td style="' + cellStyle + '">R' + r + '</td>';

      for (var j = 0; j < nodes.length; j++) {
        var v = snapshots[r][nodes[j]];
        s += '<td style="' + cellStyle + '">' +
          v.dist + ' / ' + v.prev + '</td>';
      }

      s += '</tr>';
    }

    return s + '</tbody></table>';
  }

  function player(root, titleText, steps) {
    if (window.V6 && V6.title) V6.title(root, titleText);

    var stage = h('div', null, root);
    stage.style.cssText = 'border:1px solid ' + INK +
      ';background:#fff;padding:10px;overflow-x:auto';

    var note = h('div', { 'class': 'v6-note' }, root);
    var bar = h('div', { 'class': 'v6-controls' }, root);

    var prev = h('button', { 'class': 'v6-btn' }, bar);
    prev.textContent = '◀ 이전';

    var pos = h('span', { 'class': 'v6-pos' }, bar);

    var next = h('button', { 'class': 'v6-btn' }, bar);
    next.textContent = '다음 ▶';

    var i = 0;

    function show() {
      stage.innerHTML = steps[i].svg;
      note.innerHTML = steps[i].note;
      pos.textContent = (i + 1) + ' / ' + steps.length;
      prev.disabled = i === 0;
      next.disabled = i === steps.length - 1;
    }

    prev.onclick = function () {
      if (i > 0) {
        i--;
        show();
      }
    };

    next.onclick = function () {
      if (i < steps.length - 1) {
        i++;
        show();
      }
    };

    show();
  }

  var steps = [];

  var roundNotes = [
    '초기화. 시작점 A의 dist는 0, 나머지는 ∞이다. 표의 각 셀은 dist(거리) / prev(이전 정점)이다. 빨강은 이번 라운드에 갱신된 노드·원인 간선과 음수 간선을 나타낸다. <b>동기식</b> 라운드 i 끝의 dist는 간선 i개 이하를 사용하는 경로 중 최솟값이다.',
    '라운드 1: 라운드 0 스냅샷만 사용한다. A→B로 dist(B)=4, A→C로 dist(C)=2가 된다. D와 E는 아직 도달할 수 있는 경로가 없다.',
    '라운드 2: 라운드 1의 값으로 계산한다. B→C를 통해 dist(C)=4+(−3)=1로 갱신된다. 같은 스냅샷의 C=2를 사용해 C→D로 dist(D)=5, C→E로 dist(E)=6이 된다. C→B의 후보값 5는 기존 B=4보다 크다.',
    '라운드 3: 라운드 2의 값으로 계산한다. C의 dist=1을 사용해 C→D로 dist(D)=1+3=4, C→E로 dist(E)=1+4=5가 된다.',
    '라운드 4: 라운드 3의 값으로 계산한다. E의 dist=5를 사용해 E→D로 dist(D)=5+(−2)=3으로 갱신된다. 모든 정점의 최단 거리와 이전 정점이 확정된다.'
  ];

  var changedByRound = [
    [],
    ['B', 'C'],
    ['C', 'D', 'E'],
    ['D', 'E'],
    ['D']
  ];

  var causesByRound = [
    [],
    ['AB', 'AC'],
    ['BC', 'CD', 'CE'],
    ['CD', 'CE'],
    ['ED']
  ];

  for (var r = 0; r <= 4; r++) {
    steps.push({
      note: roundNotes[r],
      svg: graphSvg(
        snapshots[r],
        changedByRound[r],
        causesByRound[r],
        false
      ) + tableHTML(r)
    });
  }

  steps.push({
    note: '라운드 5 검사: 어떤 간선도 dist를 더 줄이지 못한다. 따라서 시작점 A에서 도달 가능한 negative cycle(음수 사이클)은 없다. 슬라이드 코드는 in-place(제자리) 갱신이다. 간선을 시작 정점의 알파벳 순으로 처리하면 이 그래프는 한 번의 순회에 수렴한다. 이 방식의 중간 스냅샷은 간선 순서에 따라 달라지지만, 최종값과 |V|−1 라운드 보장은 간선 순서와 무관하다.',
    svg: graphSvg(snapshots[5], [], [], false) + tableHTML(5)
  });

  steps.push({
    note: '최종 최단 경로 트리인 shortest path tree (SPT, 최단 경로 트리)는 굵은 간선 A→B, B→C, C→E, E→D이다. Dijkstra(다익스트라)를 이 그래프에 그대로 적용하면 D=5, E=6으로 틀린다 (정답 D=3, E=5). C가 2로 확정된 뒤 B를 처리하면서 C가 1이 되어도, 이미 처리가 끝난 C의 간선은 다시 확인하지 못한다.',
    svg: graphSvg(snapshots[5], [], [], true) + tableHTML(5)
  });

  player(
    root,
    'Bellman-Ford (시작 A) — 음수 간선 최단 경로',
    steps
  );
});

/* ---- MST Kruskal/Prim (mst-kruskal, mst-prim) ---- */
(function () {
  var INK = '#1a1a1a';
  var RED = '#9e2b25';
  var GRID = '#e8e6e0';
  var NS = 'http://www.w3.org/2000/svg';

  var nodes = ['A', 'B', 'C', 'D', 'E', 'F'];

  var positions = {
    A: { x: 90, y: 60 },
    C: { x: 240, y: 60 },
    E: { x: 390, y: 60 },
    B: { x: 90, y: 190 },
    D: { x: 240, y: 190 },
    F: { x: 390, y: 190 }
  };

  var edges = [
    { id: 'BC', u: 'B', v: 'C', w: 1, d: 'M 104 178 Q 122 120 227 72', lx: 143, ly: 113 },
    { id: 'CD', u: 'C', v: 'D', w: 2, d: 'M 240 77 L 240 173', lx: 254, ly: 127 },
    { id: 'BD', u: 'B', v: 'D', w: 2, d: 'M 107 190 L 223 190', lx: 165, ly: 181 },
    { id: 'CF', u: 'C', v: 'F', w: 3, d: 'M 253 72 L 377 178', lx: 326, ly: 136 },
    { id: 'AD', u: 'A', v: 'D', w: 4, d: 'M 103 72 Q 205 120 227 178', lx: 181, ly: 139 },
    { id: 'DF', u: 'D', v: 'F', w: 4, d: 'M 257 190 L 373 190', lx: 315, ly: 181 },
    { id: 'EF', u: 'E', v: 'F', w: 4, d: 'M 390 77 L 390 173', lx: 404, ly: 128 },
    { id: 'AB', u: 'A', v: 'B', w: 5, d: 'M 90 77 L 90 173', lx: 74, ly: 128 },
    { id: 'CE', u: 'C', v: 'E', w: 5, d: 'M 257 60 L 373 60', lx: 315, ly: 50 },
    { id: 'AC', u: 'A', v: 'C', w: 6, d: 'M 107 60 L 223 60', lx: 165, ly: 50 }
  ];

  var edgeById = {};
  edges.forEach(function (e) {
    edgeById[e.id] = e;
  });

  function h(tag, attrs, parent) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        el.setAttribute(key, attrs[key]);
      });
    }
    if (parent) parent.appendChild(el);
    return el;
  }

  function setOf(arr) {
    var out = {};
    (arr || []).forEach(function (v) {
      out[v] = true;
    });
    return out;
  }

  function svgOpen(w, height) {
    return '<svg xmlns="' + NS + '" width="' + w + '" height="' + height +
      '" viewBox="0 0 ' + w + ' ' + height +
      '" style="max-width:none;height:auto;display:block;background:#fff;' +
      'font-family:\'Noto Sans KR\',sans-serif">';
  }

  function representatives(selected) {
    var adj = {};
    nodes.forEach(function (n) {
      adj[n] = [];
    });

    selected.forEach(function (id) {
      var e = edgeById[id];
      adj[e.u].push(e.v);
      adj[e.v].push(e.u);
    });

    var result = {};
    var visited = {};

    nodes.forEach(function (start) {
      if (visited[start]) return;

      var group = [];
      var stack = [start];
      visited[start] = true;

      while (stack.length) {
        var u = stack.pop();
        group.push(u);

        adj[u].forEach(function (v) {
          if (!visited[v]) {
            visited[v] = true;
            stack.push(v);
          }
        });
      }

      group.sort();
      group.forEach(function (n) {
        result[n] = group[0];
      });
    });

    return result;
  }

  function crossingEdges(inS) {
    return edges.filter(function (e) {
      return !!inS[e.u] !== !!inS[e.v];
    }).map(function (e) {
      return e.id;
    });
  }

  function graphSvg(opts) {
    var s = svgOpen(480, 245);
    var selected = setOf(opts.selected);
    var processed = setOf(opts.processed);
    var candidates = setOf(opts.candidates);
    var inS = setOf(opts.S);
    var reps = opts.reps || {};
    var mode = opts.mode;

    if (mode === 'prim') {
      crossingEdges(inS).forEach(function (id) {
        candidates[id] = true;
      });
    }

    s += '<text x="10" y="15" font-size="10" fill="' + INK + '">';
    s += mode === 'kruskal'
      ? '대표: 현재 연결 요소의 사전순 최소 정점'
      : 'S: 트리 정점 · 빨강: 현재 선택 간선 / 후보 가중치';
    s += '</text>';

    edges.forEach(function (e) {
      var color = INK;
      var width = 1.4;
      var dash = '';

      if (mode === 'kruskal') {
        if (e.id === opts.current) {
          color = RED;
          width = 2.8;
        } else if (selected[e.id]) {
          color = INK;
          width = 3.8;
        } else if (processed[e.id]) {
          color = GRID;
          width = 2;
          dash = ' stroke-dasharray="6 5"';
        }
      } else {
        if (e.id === opts.current) {
          color = RED;
          width = 2.8;
        } else if (selected[e.id]) {
          color = INK;
          width = 3.8;
        }
      }

      s += '<path d="' + e.d + '" fill="none" stroke="' + color +
        '" stroke-width="' + width + '"' + dash +
        ' stroke-linecap="round" stroke-linejoin="round"/>';

      var labelColor = INK;
      var labelWeight = '400';

      if (mode === 'kruskal' && e.id === opts.current) {
        labelColor = RED;
        labelWeight = '700';
      } else if (mode === 'prim' &&
          (e.id === opts.current || candidates[e.id])) {
        labelColor = RED;
        labelWeight = '700';
      }

      s += '<text x="' + e.lx + '" y="' + e.ly +
        '" text-anchor="middle" font-size="12" font-weight="' +
        labelWeight + '" fill="' + labelColor +
        '" style="paint-order:stroke;stroke:#fff;stroke-width:4px;' +
        'stroke-linejoin:round">' + e.w + '</text>';
    });

    var drawOrder = ['A', 'C', 'E', 'B', 'D', 'F'];

    drawOrder.forEach(function (name) {
      var p = positions[name];
      var inside = !!inS[name];
      var fill = mode === 'prim' && inside ? INK : '#fff';
      var textColor = mode === 'prim' && inside ? '#fff' : INK;

      s += '<circle cx="' + p.x + '" cy="' + p.y +
        '" r="17" fill="' + fill + '" stroke="' + INK +
        '" stroke-width="1.6"/>';

      s += '<text x="' + p.x + '" y="' + (p.y + 4) +
        '" text-anchor="middle" font-size="13" font-weight="700" fill="' +
        textColor + '">' + name + '</text>';

      if (mode === 'kruskal') {
        s += '<text x="' + (p.x + 20) + '" y="' + (p.y + 25) +
          '" font-size="9" fill="' + INK + '">대표 ' +
          (reps[name] || name) + '</text>';
      }
    });

    return s + '</svg>';
  }

  function tableHtml(rows, emptyText) {
    var tableStyle = 'border-collapse:collapse;width:100%;min-width:250px;' +
      'margin-top:8px;background:#fff;color:' + INK +
      ';font-family:\'Noto Sans KR\',sans-serif;font-size:12px;';
    var thStyle = 'border:1px solid ' + INK +
      ';padding:5px 8px;text-align:center;font-weight:700;background:#fff;';
    var tdStyle = 'border:1px solid ' + INK +
      ';padding:5px 8px;text-align:center;background:#fff;';

    var s = '<table style="' + tableStyle + '"><thead><tr>';
    ['남은 정점', 'cost', 'prev'].forEach(function (label) {
      s += '<th style="' + thStyle + '">' + label + '</th>';
    });
    s += '</tr></thead><tbody>';

    if (!rows.length) {
      s += '<tr><td colspan="3" style="' + tdStyle + '">' +
        (emptyText || '남은 정점 없음') + '</td></tr>';
    } else {
      rows.forEach(function (r) {
        s += '<tr><td style="' + tdStyle + '">' + r.node +
          '</td><td style="' + tdStyle + '">' + r.cost +
          '</td><td style="' + tdStyle + '">' + r.prev + '</td></tr>';
      });
    }

    return s + '</tbody></table>';
  }

  function player(root, titleText, steps) {
    if (window.V6 && V6.title) V6.title(root, titleText);

    var stage = h('div', null, root);
    stage.style.cssText = 'border:1px solid ' + INK +
      ';background:#fff;padding:10px;overflow-x:auto;';

    var note = h('div', { 'class': 'v6-note' }, root);
    var controls = h('div', { 'class': 'v6-controls' }, root);

    var prev = h('button', { 'class': 'v6-btn' }, controls);
    prev.textContent = '◀ 이전';

    var pos = h('span', { 'class': 'v6-pos' }, controls);

    var next = h('button', { 'class': 'v6-btn' }, controls);
    next.textContent = '다음 ▶';

    var i = 0;

    function show() {
      stage.innerHTML = steps[i].svg;
      note.innerHTML = steps[i].note;
      pos.textContent = (i + 1) + ' / ' + steps.length;
      prev.disabled = i === 0;
      next.disabled = i === steps.length - 1;
    }

    prev.onclick = function () {
      if (i > 0) {
        i--;
        show();
      }
    };

    next.onclick = function () {
      if (i < steps.length - 1) {
        i++;
        show();
      }
    };

    show();
  }

  V6.register('mst-kruskal', function (root) {
    var steps = [];
    var chosen = [];
    var processed = [];

    steps.push({
      note: '초기 상태. 6개 정점이 각각 별도 집합이다. 간선을 가중치 오름차순으로 검사한다. find(u), find(v)가 다르면 간선을 추가하고 두 집합을 합친다. 같으면 cycle(사이클)이 생기므로 버린다. 현재 집합 수: <b>6</b>, 누적 weight: <b>0</b>.',
      svg: graphSvg({
        mode: 'kruskal',
        selected: [],
        processed: [],
        current: null,
        reps: representatives([])
      })
    });

    var rounds = [
      {
        id: 'BC', add: true, before: 6, after: 5, total: 1,
        note: '<b>1. B–C (1)</b>: find(B)=B, find(C)=C. 서로 다른 집합이므로 추가한다. 집합 수 6→5, 누적 weight=<b>1</b>.'
      },
      {
        id: 'CD', add: true, before: 5, after: 4, total: 3,
        note: '<b>2. C–D (2)</b>: find(C)=B, find(D)=D. 서로 다른 집합이므로 추가한다. 집합 수 5→4, 누적 weight=<b>3</b>.'
      },
      {
        id: 'BD', add: false, before: 4, after: 4, total: 3,
        note: '<b>3. B–D (2)</b>: find(B)=B, find(D)=B. 이미 같은 집합이다. B–C–D 경로가 있으므로 cycle(사이클)이 생겨 버린다. 집합 수 <b>4</b>, 누적 weight=<b>3</b>.'
      },
      {
        id: 'CF', add: true, before: 4, after: 3, total: 6,
        note: '<b>4. C–F (3)</b>: find(C)=B, find(F)=F. 서로 다른 집합이므로 추가한다. 집합 수 4→3, 누적 weight=<b>6</b>.'
      },
      {
        id: 'AD', add: true, before: 3, after: 2, total: 10,
        note: '<b>5. A–D (4)</b>: find(A)=A, find(D)=B. 서로 다른 집합이므로 추가한다. 집합 수 3→2, 누적 weight=<b>10</b>.'
      },
      {
        id: 'DF', add: false, before: 2, after: 2, total: 10,
        note: '<b>6. D–F (4)</b>: find(D)=A, find(F)=A. 이미 같은 집합이므로 버린다. D와 F는 선택된 간선으로 연결되어 있다. 집합 수 <b>2</b>, 누적 weight=<b>10</b>.'
      },
      {
        id: 'EF', add: true, before: 2, after: 1, total: 14,
        note: '<b>7. E–F (4)</b>: find(E)=E, find(F)=A. 서로 다른 집합이므로 추가한다. 모든 정점이 하나의 집합으로 연결된다. 집합 수 2→1, 누적 weight=<b>14</b>.'
      },
      {
        id: 'AB', add: false, before: 1, after: 1, total: 14,
        note: '<b>8. A–B (5)</b>: find(A)=A, find(B)=A. 이미 같은 집합이므로 버린다. MST는 7번 검사에서 완성됐으므로 여기서 종료할 수 있지만, 손계산 표(8–10행)처럼 남은 간선을 끝까지 검사하면 모두 버려진다. 집합 수 <b>1</b>, 누적 weight=<b>14</b>.'
      },
      {
        id: 'CE', add: false, before: 1, after: 1, total: 14,
        note: '<b>9. C–E (5)</b>: find(C)=A, find(E)=A. 이미 같은 집합이므로 버린다. 집합 수 <b>1</b>, 누적 weight=<b>14</b>.'
      },
      {
        id: 'AC', add: false, before: 1, after: 1, total: 14,
        note: '<b>10. A–C (6)</b>: find(A)=A, find(C)=A. 이미 같은 집합이므로 버린다. 집합 수 <b>1</b>, 누적 weight=<b>14</b>.'
      }
    ];

    rounds.forEach(function (r, index) {
      if (r.add) chosen.push(r.id);
      processed.push(r.id);

      steps.push({
        note: r.note,
        svg: graphSvg({
          mode: 'kruskal',
          selected: chosen.slice(),
          processed: processed.slice(),
          current: r.id,
          reps: representatives(chosen)
        })
      });
    });

    steps.push({
      note: 'MST(Minimum Spanning Tree, 최소 신장 트리) 완성. 정점 6개이므로 간선은 5개이며, 총 weight=<b>14</b>다. 이 그래프에는 MST가 2개 있다. C–D(2) 대신 B–D(2)를 선택해도 총 weight는 14다. A–D(4)와 E–F(4)는 각각 A와 E를 나머지 그래프에 연결하는 유일한 최소 가중치 간선이므로 두 MST 모두에 포함된다.',
      svg: graphSvg({
        mode: 'kruskal',
        selected: chosen.slice(),
        processed: processed.slice(),
        current: null,
        reps: representatives(chosen)
      })
    });

    player(
      root,
      'Kruskal — 가장 가벼운 간선부터, cycle이면 버림',
      steps
    );
  });

  V6.register('mst-prim', function (root) {
    var steps = [];

    var primStates = [
      {
        S: ['A'],
        selected: [],
        current: null,
        rows: [
          { node: 'B', cost: '5', prev: 'A' },
          { node: 'C', cost: '6', prev: 'A' },
          { node: 'D', cost: '4', prev: 'A' },
          { node: 'E', cost: '∞', prev: '–' },
          { node: 'F', cost: '∞', prev: '–' }
        ],
        note: '초기화. S={A}. S 밖의 각 정점에 대해 현재 알려진 최소 연결 비용 cost와 이전 정점 prev를 기록한다. A와 직접 연결된 후보는 A–D(4), A–B(5), A–C(6)이다. 다음 선택은 D(4). 선택 순서: <b>A</b>.'
      },
      {
        S: ['A', 'D'],
        selected: ['AD'],
 
       current: 'AD',
        rows: [
          { node: 'B', cost: '2', prev: 'D' },
          { node: 'C', cost: '2', prev: 'D' },
          { node: 'E', cost: '∞', prev: '–' },
          { node: 'F', cost: '4', prev: 'D' }
        ],
        note: 'D 선택: A–D(4). S={A,D}. D를 통해 B의 cost는 5→2, C는 6→2, F는 ∞→4로 갱신된다. 선택 순서: <b>A → D(4)</b>. B와 C의 cost가 2로 동점이다. 여기서는 C를 먼저 선택한다. B를 먼저 선택하면 B–D(2)를 쓰는 다른 MST(총 weight 14)가 된다.'
      },
      {
        S: ['A', 'D', 'C'],
        selected: ['AD', 'CD'],
        current: 'CD',
        rows: [
          { node: 'B', cost: '1', prev: 'C' },
          { node: 'E', cost: '5', prev: 'C' },
          { node: 'F', cost: '3', prev: 'C' }
        ],
        note: 'C 선택: D–C(2). S={A,D,C}. C–B(1)을 통해 B의 cost가 2→1, C–F(3)을 통해 F가 4→3, C–E(5)를 통해 E가 ∞→5로 갱신된다. 선택 순서: <b>A → D(4) → C(2)</b>.'
      },
      {
        S: ['A', 'D', 'C', 'B'],
        selected: ['AD', 'CD', 'BC'],
        current: 'BC',
        rows: [
          { node: 'E', cost: '5', prev: 'C' },
          { node: 'F', cost: '3', prev: 'C' }
        ],
        note: 'B 선택: C–B(1). S={A,D,C,B}. B에서 나가는 간선으로 기존 cost를 더 줄일 수 없으므로 갱신은 없다. 선택 순서: <b>A → D(4) → C(2) → B(1)</b>.'
      },
      {
        S: ['A', 'D', 'C', 'B', 'F'],
        selected: ['AD', 'CD', 'BC', 'CF'],
        current: 'CF',
        rows: [
          { node: 'E', cost: '4', prev: 'F' }
        ],
        note: 'F 선택: C–F(3). S={A,D,C,B,F}. F–E(4)를 통해 E의 cost가 5→4, prev가 C→F로 갱신된다. 선택 순서: <b>A → D(4) → C(2) → B(1) → F(3)</b>.'
      },
      {
        S: ['A', 'D', 'C', 'B', 'F', 'E'],
        selected: ['AD', 'CD', 'BC', 'CF', 'EF'],
        current: 'EF',
        rows: [],
        note: 'E 선택: F–E(4). 모든 정점이 S에 포함되어 MST가 완성된다. 총 weight=<b>14</b>. 선택 순서: <b>A → D(4) → C(2) → B(1) → F(3) → E(4)</b>. Kruskal과 같은 트리 A–D, D–C, C–B, C–F, F–E를 얻었다. S={A,D}에서 B와 C는 cost 2로 동점이었다. B를 먼저 선택하면 B–D(2)를 사용하는 다른 MST도 총 weight 14로 완성된다.'
      }
    ];

    primStates.forEach(function (state) {
      steps.push({
        note: state.note,
        svg: graphSvg({
          mode: 'prim',
          S: state.S,
          selected: state.selected,
          current: state.current
        }) + tableHtml(state.rows, '남은 정점 없음')
      });
    });

    player(
      root,
      'Prim — tree에서 가장 싼 교차 간선으로 확장 (시작 A)',
      steps
    );
  });
})();

/* ---- Union-Find (union-find) ---- */
V6.register('union-find', function (root) {
  var INK = '#1a1a1a', RED = '#9e2b25', GRID = '#e8e6e0';
  var NS = 'http://www.w3.org/2000/svg';
  var nodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  var nodeIndex = {};

  nodes.forEach(function (n, i) {
    nodeIndex[n] = i;
  });

  function h(tag, attrs, parent) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        e.setAttribute(k, attrs[k]);
      });
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  function svgOpen(w, height) {
    return '<svg xmlns="' + NS + '" width="' + w + '" height="' + height +
      '" viewBox="0 0 ' + w + ' ' + height +
      '" style="max-width:none;height:auto;display:block;background:#fff;' +
      'font-family:\'Noto Sans KR\',sans-serif">';
  }

  function makeState(parent, rank) {
    return {
      parent: Object.assign({}, parent),
      rank: Object.assign({}, rank)
    };
  }

  function setOf(arr) {
    var out = {};
    (arr || []).forEach(function (v) {
      out[v] = true;
    });
    return out;
  }

  function layoutForest(state) {
    var children = {};
    var roots = [];
    var positions = {};

    nodes.forEach(function (n) {
      children[n] = [];
    });

    nodes.forEach(function (n) {
      var p = state.parent[n];
      if (p === n) {
        roots.push(n);
      } else {
        children[p].push(n);
      }
    });

    nodes.forEach(function (n) {
      children[n].sort(function (a, b) {
        return nodeIndex[a] - nodeIndex[b];
      });
    });

    function minSubtree(n) {
      var min = nodeIndex[n];
      children[n].forEach(function (c) {
        min = Math.min(min, minSubtree(c));
      });
      return min;
    }

    roots.sort(function (a, b) {
      return minSubtree(a) - minSubtree(b);
    });

    var leafCount = 0;

    function countLeaves(n) {
      if (children[n].length === 0) {
        leafCount++;
        return;
      }
      children[n].forEach(countLeaves);
    }

    roots.forEach(countLeaves);

    var left = 34;
    var right = 526;
    var gap = leafCount > 1
      ? (right - left) / (leafCount - 1)
      : 0;
    var nextX = left;

    function place(n, depth) {
      var x;

      if (children[n].length === 0) {
        x = nextX;
        nextX += gap;
      } else {
        var xs = [];
        children[n].forEach(function (c) {
          place(c, depth + 1);
          xs.push(positions[c].x);
        });

        x = xs.reduce(function (sum, value) {
          return sum + value;
        }, 0) / xs.length;
      }

      positions[n] = {
        x: x,
        y: 39 + depth * 59,
        depth: depth
      };
    }

    roots.forEach(function (r) {
      place(r, 0);
    });

    return {
      positions: positions,
      children: children,
      roots: roots
    };
  }

  function forestSvg(state, opts) {
    opts = opts || {};

    var redNodes = setOf(opts.redNodes);
    var redPointers = setOf(opts.redPointers);
    var pathPointers = setOf(opts.pathPointers);
    var layout = layoutForest(state);
    var pos = layout.positions;
    var s = svgOpen(560, 205);

    s += '<defs>';
    s += '<marker id="uf-arrow-ink" markerWidth="8" markerHeight="8" ' +
      'refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">' +
      '<path d="M0,0 L6,3 L0,6 Z" fill="' + INK + '"/></marker>';
    s += '<marker id="uf-arrow-red" markerWidth="8" markerHeight="8" ' +
      'refX="6" refY="3" orient="auto" markerUnits="userSpaceOnUse">' +
      '<path d="M0,0 L6,3 L0,6 Z" fill="' + RED + '"/></marker>';
    s += '</defs>';

    s += '<text x="10" y="16" font-size="10" fill="' + INK +
      '">원 안: 정점 / rank(랭크) · 화살표: 자식 → 부모</text>';

    nodes.forEach(function (n) {
      var p = state.parent[n];

      if (p === n) return;

      var a = pos[n];
      var b = pos[p];
      var dx = b.x - a.x;
      var dy = b.y - a.y;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var radius = 20;

      var sx = a.x + dx / len * radius;
      var sy = a.y + dy / len * radius;
      var ex = b.x - dx / len * radius;
      var ey = b.y - dy / len * radius;

      var isChanged = !!redPointers[n];
      var isPath = !!pathPointers[n];
      var color = isChanged || isPath ? RED : INK;
      var width = isChanged ? 2.8 : (isPath ? 2.2 : 1.5);

      s += '<path d="M ' + sx + ' ' + sy + ' L ' + ex + ' ' + ey +
        '" fill="none" stroke="' + color + '" stroke-width="' + width +
        '" stroke-linecap="round" marker-end="url(#uf-arrow-' +
        (color === RED ? 'red' : 'ink') + ')"/>';
    });

    nodes.forEach(function (n) {
      var p = pos[n];
      var color = redNodes[n] ? RED : INK;

      s += '<circle cx="' + p.x + '" cy="' + p.y +
        '" r="19" fill="#fff" stroke="' + color +
        '" stroke-width="' + (redNodes[n] ? 2.8 : 1.5) + '"/>';

      s += '<text x="' + p.x + '" y="' + (p.y - 2) +
        '" text-anchor="middle" font-size="11" font-weight="700" fill="' +
        color + '">' + n + '</text>';

      s += '<text x="' + p.x + '" y="' + (p.y + 10) +
        '" text-anchor="middle" font-size="10" fill="' + color +
        '">r=' + state.rank[n] + '</text>';
    });

    return s + '</svg>';
  }

  function tableHtml(state) {
    var border = 'border:1px solid #1a1a1a;';
    var base = border +
      'padding:5px 7px;text-align:center;background:#fff;color:#1a1a1a;';
    var head = base + 'font-weight:700;';
    var s = '<table style="border-collapse:collapse;width:100%;' +
      'min-width:400px;margin-top:8px;font-family:\'Noto Sans KR\',sans-serif;' +
      'font-size:12px;background:#fff;color:#1a1a1a;">';

    s += '<thead><tr><th style="' + head + '">항목</th>';

    nodes.forEach(function (n) {
      s += '<th style="' + head + '">' + n + '</th>';
    });

    s += '</tr></thead><tbody>';

    s += '<tr><th style="' + head + '">π(x)</th>';
    nodes.forEach(function (n) {
      s += '<td style="' + base + '">' + state.parent[n] + '</td>';
    });
    s
 += '</tr>';

    s += '<tr><th style="' + head + '">rank</th>';
    nodes.forEach(function (n) {
      s += '<td style="' + base + '">' + state.rank[n] + '</td>';
    });
    s += '</tr>';

    s += '</tbody></table>';

    var roots = nodes.filter(function (n) {
      return state.parent[n] === n;
    });

    s += '<div style="font-family:\'Noto Sans KR\',sans-serif;' +
      'font-size:12px;color:' + INK + ';margin-top:6px;">' +
      'root 수: <b>' + roots.length + '</b>' +
      ' · root: <b>' + roots.join(', ') + '</b></div>';

    return s;
  }

  function player(root, titleText, steps) {
    if (window.V6 && V6.title) V6.title(root, titleText);

    var stage = h('div', null, root);
    stage.style.cssText = 'border:1px solid ' + INK +
      ';background:#fff;padding:10px;overflow-x:auto;';

    var note = h('div', { 'class': 'v6-note' }, root);
    var controls = h('div', { 'class': 'v6-controls' }, root);

    var prev = h('button', { 'class': 'v6-btn' }, controls);
    prev.textContent = '◀ 이전';

    var pos = h('span', { 'class': 'v6-pos' }, controls);

    var next = h('button', { 'class': 'v6-btn' }, controls);
    next.textContent = '다음 ▶';

    var i = 0;

    function show() {
      stage.innerHTML = steps[i].svg;
      note.innerHTML = steps[i].note;
      pos.textContent = (i + 1) + ' / ' + steps.length;
      prev.disabled = i === 0;
      next.disabled = i === steps.length - 1;
    }

    prev.onclick = function () {
      if (i > 0) {
        i--;
        show();
      }
    };

    next.onclick = function () {
      if (i < steps.length - 1) {
        i++;
        show();
      }
    };

    show();
  }

  var initial = makeState(
    { A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F', G: 'G' },
    { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 }
  );

  var afterAD = makeState(
    { A: 'D', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F', G: 'G' },
    { A: 0, B: 0, C: 0, D: 1, E: 0, F: 0, G: 0 }
  );

  var afterBE = makeState(
    { A: 'D', B: 'E', C: 'C', D: 'D', E: 'E', F: 'F', G: 'G' },
    { A: 0, B: 0, C: 0, D: 1, E: 1, F: 0, G: 0 }
  );

  var afterCF = makeState(
    { A: 'D', B: 'E', C: 'F', D: 'D', E: 'E', F: 'F', G: 'G' },
    { A: 0, B: 0, C: 0, D: 1, E: 1, F: 1, G: 0 }
  );

  var afterCG = makeState(
    { A: 'D', B: 'E', C: 'F', D: 'D', E: 'E', F: 'F', G: 'F' },
    { A: 0, B: 0, C: 0, D: 1, E: 1, F: 1, G: 0 }
  );

  var afterEA = makeState(
    { A: 'D', B: 'E', C: 'F', D: 'D', E: 'D', F: 'F', G: 'F' },
    { A: 0, B: 0, C: 0, D: 2, E: 1, F: 1, G: 0 }
  );

  var afterBG = makeState(
    { A: 'D', B: 'E', C: 'F', D: 'D', E: 'D', F: 'D', G: 'F' },
    { A: 0, B: 0, C: 0, D: 2, E: 1, F: 1, G: 0 }
  );

  var afterFindG = makeState(
    { A: 'D', B: 'E', C: 'F', D: 'D', E: 'D', F: 'D', G: 'D' },
    { A: 0, B: 0, C: 0, D: 2, E: 1, F: 1, G: 0 }
  );

  var steps = [];

  function addStep(label, state, note, opts) {
    opts = opts || {};

    steps.push({
      note: note,
      svg: forestSvg(state, opts) + tableHtml(state)
    });
  }

  addStep(
    '0 · makeset',
    initial,
    '<b>0. makeset × 7.</b> A, B, C, D, E, F, G를 각각 독립 집합으로 초기화한다. ' +
    '모든 정점은 자기 자신을 부모로 가지며 rank=0이다. 연결 성분 수는 <b>7</b>.',
    {}
  );

  addStep(
    '1 · union(A, D)',
    afterAD,
    '<b>1. union(A, D).</b> find(A)=A(rank 0), find(D)=D(rank 0). ' +
    'rank가 같으므로 첫 번째 인자의 root A를 두 번째 root D 아래에 붙인다. ' +
    'π(A)=D, rank(D): 0→1. 연결 성분 수 <b>7→6</b>.',
    {
      redNodes: ['A', 'D'],
      redPointers: ['A']
    }
  );

  addStep(
    '2 · union(B, E)',
    afterBE,
    '<b>2. union(B, E).</b> find(B)=B(rank 0), find(E)=E(rank 0). ' +
    'rank가 같으므로 B를 E 아래에 붙인다. π(B)=E, rank(E): 0→1. ' +
    '연결 성분 수 <b>6→5</b>.',
    {
      redNodes: ['B', 'E'],
      redPointers: ['B']
    }
  );

  addStep(
    '3 · union(C, F)',
    afterCF,
    '<b>3. union(C, F).</b> find(C)=C(rank 0), find(F)=F(rank 0). ' +
    'rank가 같으므로 C를 F 아래에 붙인다. π(C)=F, rank(F): 0→1. ' +
    '연결 성분 수 <b>5→4</b>. 첫 세 union 후 연결 성분은 7개에서 4개로 줄었다.',
    {
      redNodes: ['C', 'F'],
      redPointers: ['C']
    }
  );

  addStep(
    '4 · union(C, G)',
    afterCG,
    '<b>4. union(C, G).</b> find(C)=F(rank 1), find(G)=G(rank 0). ' +
    'rank가 낮은 G를 F 아래에 붙인다. π(G)=F. rank(F)는 <b>1로 유지</b>된다. ' +
    '연결 성분 수 <b>4→3</b>.',
    {
      redNodes: ['G'],
      redPointers: ['G']
    }
  );

  addStep(
    '5 · union(E, A)',
    afterEA,
    '<b>5. union(E, A).</b> find(E)=E(rank 1), find(A)=D(rank 1). ' +
    'rank가 같으므로 첫 번째 root E를 두 번째 root D 아래에 붙인다. ' +
    'π(E)=D, rank(D): 1→2. 연결 성분 수 <b>3→2</b>.',
    {
      redNodes: ['E', 'D'],
      redPointers: ['E']
    }
  );

  addStep(
    '6 · union(B, G)',
    afterBG,
    '<b>6. union(B, G).</b> find(B)=E→D, 따라서 root는 D(rank 2). ' +
    'find(G)=F(rank 1). rank가 낮은 F를 D 아래에 붙인다. ' +
    'π(F)=D이며 rank(D)는 2로 유지된다. 연결 성분 수 <b>2→1</b>. ' +
    '손계산 표와 마찬가지로 union 단계의 find는 경로 압축 없이 추적하므로 ' +
    'π(B)=E가 유지된다(압축 효과는 다음 find(G) 단계에서 확인). ' +
    '최종 root는 D 하나이고, 트리 높이는 2다. 연결 성분 수는 <b>7→4→2→1</b>로 감소했다.',
    {
      redNodes: ['F'],
      redPointers: ['F']
    }
  );

  addStep(
    '7 · find(G) 호출 전',
    afterBG,
    '<b>7. find(G) 호출 전.</b> 현재 경로는 <b>G → F → D</b>이며 root는 D다. ' +
    '경로 압축(path compression)을 적용하면 find(x)는 root를 찾는 순회와 압축 순회, ' +
    '두 번 지나간다. 슬라이드 코드: ' +
    '<code>if x ≠ π(x) then π(x) ← find(π(x)); return π(x)</code>.',
    {
      redNodes: ['G', 'F', 'D'],
      pathPointers: ['G', 'F']
    }
  );

  addStep(
    '8 · find(G) 호출 후',
    afterFindG,
    '<b>8. find(G) 완료.</b> 경로 압축으로 π(G)=D가 된다. F는 이미 D의 자식이므로 ' +
    'π(F)=D는 그대로다. rank는 갱신하지 않는다. rank는 union by rank가 유지하는 저장값이며, ' +
    '모든 비-root 정점에서 parent를 따라가면 rank가 엄격히 증가한다. ' +
    'G에서 root까지의 경로 길이는 2→1로 줄어든다. 다만 전체 트리 높이는 B→E→D 경로 때문에 ' +
    '여전히 2다.',
    {
      redNodes: ['G', 'F', 'D'],
      redPointers: ['G'],
      pathPointers: ['F']
    }
  );

  addStep(
    '복잡도 분석',
    afterFindG,
    '<b>시간 복잡도.</b> n개 원소에 대해 union n−1번과 find를 합쳐 총 m번의 연산(m ≥ n)을 임의 순서로 수행하면 ' +
    'O(m log* n) (분할 상환, 슬라이드 15–17)이다. 더 정밀한 상한 ' +
    'O(m·α(m,n))이 알려져 있다 (Tarjan–van Leeuwen 1984; 일치하는 하한은 Fredman–Saks 1989). α는 Ackermann(아커만) 함수의 역함수이며, ' +
  
  'n &lt; 2<sup>65536</sup>에서는 α ≤ 3이므로 사실상 상수다. ' +
    'union by rank와 path compression을 함께 사용하면 연산 전체의 분할 상환 비용이 매우 작다.',
    {}
  );

  player(root, 'Union-Find — union by rank + path compression', steps);
});

/* ---- NP reduction 지도 (np-reduction) ---- */
V6.register('np-reduction', function (root) {
  var INK = '#1a1a1a';
  var RED = '#9e2b25';
  var GRID = '#e8e6e0';
  var NS = 'http://www.w3.org/2000/svg';

  function h(tag, attrs, parent) {
    var e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        e.setAttribute(k, attrs[k]);
      });
    }
    if (parent) parent.appendChild(e);
    return e;
  }

  function svgOpen() {
    return '<svg xmlns="' + NS +
      '" width="720" height="205" viewBox="0 0 720 205"' +
      ' style="max-width:none;height:auto;display:block;background:#fff;' +
      'font-family:\'Noto Sans KR\',sans-serif">';
  }

  var nodes = [
    { id: 'sat', label: '3SAT', x: 20, w: 100 },
    { id: 'is', label: 'IS', x: 230, w: 70 },
    { id: 'vc', label: 'VC', x: 430, w: 70 },
    { id: 'clique', label: 'Clique', x: 610, w: 100 }
  ];

  var edges = [
    {
      id: 'sat-is',
      from: 'sat',
      to: 'is',
      x1: 124,
      x2: 226,
      cx: 175,
      lines: [
        '절마다 삼각형 gadget +',
        '모순 리터럴 간선,',
        'k = 절 수'
      ]
    },
    {
      id: 'is-vc',
      from: 'is',
      to: 'vc',
      x1: 304,
      x2: 426,
      cx: 365,
      bidirectional: true,
      lines: [
        '보집합, k ↦ n − k',
        '같은 map으로 양방향'
      ]
    },
    {
      id: 'vc-clique',
      from: 'vc',
      to: 'clique',
      x1: 504,
      x2: 606,
      cx: 555,
      lines: [
        'complement graph Ḡ',
        'n − k'
      ]
    }
  ];

  var descriptions = {
    'sat-is':
      '절(clause)마다 삼각형 gadget을 만들고 꼭짓점은 그 절의 리터럴 3개. ' +
      '서로 모순되는 리터럴(x와 ¬x) 쌍마다 간선을 추가. k = 절의 개수. ' +
      '만족하는 배정이 있으면 각 삼각형에서 참인 리터럴 하나씩 고른 것이 크기 k의 ' +
      'independent set(독립 집합). 반대로 크기 k의 independent set은 삼각형마다 ' +
      '꼭짓점 정확히 하나를 포함하고, 그 리터럴들을 참으로 두면 모순 없이 모든 절이 참.',

    'is-vc':
      '같은 그래프 G에서 I가 independent set ⟺ V ∖ I가 vertex cover(정점 덮개): ' +
      '어떤 간선의 양 끝이 모두 I 안에 있으면 I의 독립성에 모순이므로, 독립 집합이면 ' +
      '모든 간선이 끝점 하나 이상을 V ∖ I에 둔다(덮개). 반대로 V ∖ I가 덮개가 아니면 ' +
      '덮이지 않는 간선의 양 끝이 모두 I에 있어 I가 독립 집합이 아니다. 목표 크기는 k ↦ n − k. ' +
      '같은 map으로 VC → IS도 성립.',

    'vc-clique':
      'complement graph Ḡ(보그래프: G에 없는 간선만 간선으로)를 다항시간에 만든다. ' +
      'C가 G의 vertex cover ⟺ V ∖ C가 Ḡ의 clique(클리크). ' +
      'G에 크기 k의 VC가 있다 ⟺ Ḡ에 크기 n − k의 clique가 있다.',

    'rules':
      'A가 NP-complete이고 A ≤p B, B ∈ NP이면 B는 NP-complete ' +
      '(전이성: 임의의 L ∈ NP에 대해 L ≤p A ≤p B). ' +
      '반대로 B ≤p A만 보이는 것은 B가 A보다 어렵지 않다는 뜻일 뿐 B의 hardness는 ' +
      '말해주지 않는다. NP-hard 증명에는 \'기존 NP-complete → 나\' 방향이 필요.'
  };

  function textSvg(x, y, value, color, size, anchor, weight) {
    return '<text x="' + x + '" y="' + y +
      '" fill="' + color +
      '" font-size="' + size +
      '" text-anchor="' + (anchor || 'middle') +
      '" font-weight="' + (weight || '400') +
      '" style="paint-order:stroke;stroke:#fff;stroke-width:3px;' +
      'stroke-linejoin:round">' + value + '</text>';
  }

  function graphSvg(active) {
    var selectedEdges = {};
    var selectedNodes = {};

    if (active === 'rules') {
      edges.forEach(function (e) {
        selectedEdges[e.id] = true;
      });
      nodes.forEach(function (n) {
        selectedNodes[n.id] = true;
      });
    } else {
      edges.forEach(function (e) {
        if (e.id === active) {
          selectedEdges[e.id] = true;
          selectedNodes[e.from] = true;
          selectedNodes[e.to] = true;
        }
      });
    }

    var s = svgOpen();

    s += '<rect x="0" y="0" width="720" height="205" fill="#fff"/>';

    s += textSvg(
      360, 18,
      '다항시간 리덕션: 기존 문제 → 환원 대상',
      INK, 11, 'middle', '400'
    );

    edges.forEach(function (e) {
      var color = selectedEdges[e.id] ? RED : INK;
      var width = selectedEdges[e.id] ? 2.8 : 1.6;
      var mid = (e.x1 + e.x2) / 2;

      s += '<path d="M ' + e.x1 + ' 61 L ' + e.x2 + ' 61"' +
        ' fill="none" stroke="' + color +
        '" stroke-width="' + width +
        '" stroke-linecap="round"/>';

      s += '<polygon points="' +
        e.x2 + ',61 ' + (e.x2 - 8) + ',56 ' +
        (e.x2 - 8) + ',66" fill="' + color + '"/>';

      if (e.bidirectional) {
        s += '<polygon points="' +
          e.x1 + ',61 ' + (e.x1 + 8) + ',56 ' +
          (e.x1 + 8) + ',66" fill="' + color + '"/>';
      }

      var labelY = e.lines.length === 3 ? 112 : 119;

      e.lines.forEach(function (line, i) {
        s += textSvg(
          e.cx,
          labelY + i * 19,
          line,
          selectedEdges[e.id] ? RED : INK,
          11,
          'middle',
          selectedEdges[e.id] ? '700' : '400'
        );
      });
    });

    nodes.forEach(function (n) {
      var color = selectedNodes[n.id] ? RED : INK;
      var width = selectedNodes[n.id] ? 2.6 : 1.5;

      s += '<rect x="' + n.x + '" y="42" width="' + n.w +
        '" height="38" fill="#fff" stroke="' + color +
        '" stroke-width="' + width + '"/>';

      s += textSvg(
        n.x + n.w / 2,
        66,
        n.label,
        color,
        n.label === 'Clique' ? 14 : 15,
        'middle',
        '700'
      );
    });

    return s + '</svg>';
  }

  if (window.V6 && V6.title) {
    V6.title(root, 'NP-complete reduction 지도 — 3SAT → IS → VC → Clique');
  }

  var stage = h('div', null, root);
  stage.style.cssText =
    'border:1px solid ' + INK +
    ';background:#fff;padding:10px;overflow-x:auto;';

  var controls = h('div', { 'class': 'v6-controls' }, root);
  controls.style.cssText =
    'display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;';

  var note = h('div', { 'class': 'v6-note' }, root);

  var extra = h('div', null, root);
  extra.style.cssText =
    'border-top:1px solid ' + GRID +
    ';margin-top:10px;padding-top:8px;' +
    'font-family:\'Noto Sans KR\',sans-serif;' +
    'font-size:12px;line-height:1.7;color:' + INK + ';';

  extra.innerHTML =
    '<div><b>복잡도 분류</b></div>' +
    '<div>P = 다항시간 결정 · NP = YES 인스턴스의 다항 크기 certificate(증명서)를 ' +
    '다항시간에 검증 · NP-hard = 모든 NP 문제가 다항시간에 reduce · ' +
    'NP-complete = NP ∩ NP-hard.</div>' +
    '<div style="margin-top:5px;">' +
    '이 연쇄의 출발점은 Cook–Levin 정리가 직접 확립한 SAT의 NP-completeness ' +
    '(증명 자체는 이 노트 범위 밖, 결과만 인용)이며, 3SAT의 NP-completeness는 ' +
    'SAT ≤p 3SAT 환원으로 얻는다.</div>';

  var buttons = [
    { id: 'sat-is', label: '3SAT → IS' },
    { id: 'is-vc', label: 'IS ↔ VC' },
    { id: 'vc-clique', label: 'VC → Clique' },
    { id: 'rules', label: '방향 규칙' }
  ];

  var buttonEls = {};

  buttons.forEach(function (item) {
    var btn = h('button', {
      'class': 'v6-btn',
      'type': 'button',
      'aria-pressed': 'false'
    }, controls);

    btn.textContent = item.label;
    btn.style.cssText = 'margin:0;';

    btn.onclick = function () {
      render(item.id);
    };

    buttonEls[item.id] = btn;
  });

  function render(active) {
    stage.innerHTML = graphSvg(active);

    note.innerHTML = descriptions[active];

    buttons.forEach(function (item) {
      var btn = buttonEls[item.id];
      var isActive = item.id === active;

      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.style.borderColor = isActive ? RED : INK;
      btn.style.color = isActive ? RED : INK;
      btn.style.fontWeight = isActive ? '700' : '400';
    });
  }

  render('sat-is');
});
