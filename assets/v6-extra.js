/* csed331 v6-extra.js — 알고리즘 인터랙티브 위젯 팩
   API: V6.register(name, mountFn(el,cfg)). 스타일: 흰 배경, 잉크 #1a1a1a, 빨강 #9e2b25 포인트만.
   자기 검수: 각 위젯의 단계 생성기는 알고리즘 의사코드와 동일한 상태 전이를 따름 (아래 주석 참조). */
(function () {
  var INK = '#1a1a1a', RED = '#9e2b25', GRID = '#d8d5cc', FILL = '#f4f2ec';

  function h(tag, attrs, parent) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(e);
    return e;
  }
  function txt(parent, s) { parent.appendChild(document.createTextNode(s)); }

  /* 공통 스텝 플레이어: steps = [{note, svg}] */
  function player(root, titleText, steps) {
    if (window.V6 && V6.title) V6.title(root, titleText);
    else { var t = h('div', null, root); t.style.cssText = 'font-weight:600;margin:8px 0 4px'; t.textContent = titleText; }
    var stage = h('div', null, root);
    stage.style.cssText = 'border:1px solid ' + INK + ';background:#fff;padding:10px;overflow-x:auto';
    var note = h('div', { 'class': 'v6-note' }, root);
    var bar = h('div', { 'class': 'v6-controls' }, root);
    var prev = h('button', { 'class': 'v6-btn' }, bar); prev.textContent = '◀ 이전';
    var pos = h('span', { 'class': 'v6-pos' }, bar);
    var next = h('button', { 'class': 'v6-btn' }, bar); next.textContent = '다음 ▶';
    var i = 0;
    function show() {
      stage.innerHTML = steps[i].svg;
      note.innerHTML = steps[i].note;
      pos.textContent = (i + 1) + ' / ' + steps.length;
      prev.disabled = i === 0; next.disabled = i === steps.length - 1;
    }
    prev.onclick = function () { if (i > 0) { i--; show(); } };
    next.onclick = function () { if (i < steps.length - 1) { i++; show(); } };
    show();
  }

  var NS = 'http://www.w3.org/2000/svg';
  function svgOpen(w, hgt) { return '<svg xmlns="' + NS + '" width="' + w + '" height="' + hgt + '" style="background:#fff">'; }

  /* 막대 배열 SVG. hl = {index: color} */
  function barSvg(arr, hl, labels) {
    var w = arr.length * 44 + 20, max = Math.max.apply(null, arr), unit = 120 / max;
    var s = svgOpen(w, 165);
    for (var i = 0; i < arr.length; i++) {
      var c = (hl && hl[i]) || INK;
      var bh = arr[i] * unit;
      s += '<rect x="' + (12 + i * 44) + '" y="' + (140 - bh) + '" width="32" height="' + bh + '" fill="none" stroke="' + c + '" stroke-width="' + (hl && hl[i] ? 2.5 : 1.5) + '"/>';
      s += '<text x="' + (28 + i * 44) + '" y="156" font-size="12" text-anchor="middle" fill="' + c + '">' + (labels ? labels[i] : arr[i]) + '</text>';
    }
    return s + '</svg>';
  }

  /* 1. 삽입 정렬: i를 1..n-1로 키를 정렬된 앞부분에 삽입 */
  V6.register('sort-insertion', function (root) {
    var a0 = [7, 3, 9, 2, 8, 4], steps = [];
    var a = a0.slice();
    steps.push({ note: '초기 배열. 앞부분(인덱스 0)은 이미 정렬된 것으로 본다.', svg: barSvg(a, { 0: RED }) });
    for (var i = 1; i < a.length; i++) {
      var key = a[i], j = i - 1;
      steps.push({ note: '키 = <b>' + key + '</b>. 정렬된 구간에서 삽입 위치를 찾는다.', svg: barSvg(a, { i: RED }) });
      while (j >= 0 && a[j] > key) {
        a[j + 1] = a[j];
        var hm = {}; hm[j + 1] = RED;
        steps.push({ note: a[j] + ' &gt; ' + key + ' 이므로 한 칸 뒤로.', svg: barSvg(a, hm) });
        j--;
      }
      a[j + 1] = key;
      var hl = {}; hl[j + 1] = RED;
      steps.push({ note: '키 ' + key + '을(를) 위치 ' + (j + 1) + '에 삽입. 인덱스 0..' + i + ' 정렬 완료.', svg: barSvg(a, hl) });
    }
    steps.push({ note: '정렬 완료. 비교·이동 횟수가 입력 순서에 따라 달라진다 (최선 O(n), 최악 O(n²)).', svg: barSvg(a, null) });
    player(root, '삽입 정렬 (Insertion Sort)', steps);
  });

  /* 2. 병합 정렬: 분할 후 병합 */
  V6.register('sort-merge', function (root) {
    var a = [7, 3, 9, 2, 8, 4, 5, 1], steps = [];
    function snap(arr, hl, note) { steps.push({ note: note, svg: barSvg(arr, hl) }); }
    snap(a, null, '초기 배열. 병합 정렬은 반으로 나누고(분할) 각각을 정렬한 뒤 합친다(병합).');
    function mergeSort(lo, hi, depth) {
      if (hi - lo <= 1) return;
      var mid = (lo + hi) >> 1, hl = {};
      for (var k = lo; k < hi; k++) hl[k] = RED;
      snap(a, hl, '분할: [' + lo + '..' + (hi - 1) + '] → [' + lo + '..' + (mid - 1) + '] + [' + mid + '..' + (hi - 1) + ']');
      mergeSort(lo, mid, depth + 1); mergeSort(mid, hi, depth + 1);
      var buf = [], i = lo, j = mid;
      while (i < mid && j < hi) buf.push(a[i] <= a[j] ? a[i++] : a[j++]);
      while (i < mid) buf.push(a[i++]);
      while (j < hi) buf.push(a[j++]);
      for (var k2 = lo; k2 < hi; k2++) a[k2] = buf[k2 - lo];
      var hl2 = {}; for (var k3 = lo; k3 < hi; k3++) hl2[k3] = RED;
      snap(a, hl2, '병합: [' + lo + '..' + (hi - 1) + ']을 정렬된 상태로 합침 → [' + buf.join(', ') + ']');
    }
    mergeSort(0, a.length, 0);
    snap(a, null, '완료. 항상 O(n log n) — 병합에 O(n), 깊이 log n.');
    player(root, '병합 정렬 (Merge Sort)', steps);
  });

  /* 3. 퀵 정렬: Lomuto 분할 */
  V6.register('sort-quick', function (root) {
    var a = [7, 3, 9, 2, 8, 4, 5, 1], steps = [];
    function snap(hl, note) { steps.push({ note: note, svg: barSvg(a, hl) }); }
    snap(null, '초기 배열. 마지막 원소를 피벗으로 잡고 작은 값을 앞으로 모은다 (Lomuto 분할).');
    function quick(lo, hi) {
      if (lo >= hi) return;
      var pivot = a[hi], i = lo - 1;
      var hl = {}; hl[hi] = RED;
      snap(hl, '피벗 = <b>' + pivot + '</b> (인덱스 ' + hi + ')');
      for (var j = lo; j < hi; j++) {
        if (a[j] <= pivot) {
          i++; var t = a[i]; a[i] = a[j]; a[j] = t;
          var h2 = {}; h2[i] = RED; h2[j] = INK; h2[hi] = RED;
          snap(h2, 'a[' + j + ']=' + a[j] + ' ≤ 피벗 → 앞 구역으로 교환 (i=' + i + ')');
        }
      }
      var t2 = a[i + 1]; a[i + 1] = a[hi]; a[hi] = t2;
      var h3 = {}; h3[i + 1] = RED;
      snap(h3, '피벗을 위치 ' + (i + 1) + '에 확정. 왼쪽은 모두 ≤, 오른쪽은 모두 > 피벗');
      quick(lo, i); quick(i + 2, hi);
    }
    quick(0, a.length - 1);
    snap(null, '완료. 평균 O(n log n), 최악(이미 정렬된 입력) O(n²).');
    player(root, '퀵 정렬 (Quick Sort)', steps);
  });

  /* 4. 힙: insert + extract-max (배열 + 트리) */
  V6.register('heap-ops', function (root) {
    var heap = [12, 7, 10, 3, 8, 5], steps = [];
    function treeSvg(hl) {
      var pos = [[170, 30], [90, 80], [250, 80], [50, 130], [130, 130], [210, 130], [290, 130], [10, 175], [90, 175], [170, 175]];
      var edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [3, 8], [4, 9]];
      var s = svgOpen(340, 200);
      edges.forEach(function (e) {
        if (e[1] < heap.length) s += '<line x1="' + pos[e[0]][0] + '" y1="' + pos[e[0]][1] + '" x2="' + pos[e[1]][0] + '" y2="' + pos[e[1]][1] + '" stroke="' + GRID + '" stroke-width="1.5"/>';
      });
      for (var i = 0; i < heap.length; i++) {
        var c = (hl && hl[i]) || INK;
        s += '<circle cx="' + pos[i][0] + '" cy="' + pos[i][1] + '" r="16" fill="#fff" stroke="' + c + '" stroke-width="' + (hl && hl[i] ? 2.5 : 1.5) + '"/>';
        s += '<text x="' + pos[i][0] + '" y="' + (pos[i][1] + 4) + '" font-size="13" text-anchor="middle" fill="' + c + '">' + heap[i] + '</text>';
      }
      s += '<text x="10" y="196" font-size="11" fill="#555">배열: [' + heap.join(', ') + ']</text>';
      return s + '</svg>';
    }
    steps.push({ note: '최대 힙: 부모 ≥ 자식. 배열 [12, 7, 10, 3, 8, 5]는 이미 힙 조건을 만족한다.', svg: treeSvg(null) });
    heap.push(15);
    steps.push({ note: '<b>insert(15)</b>: 일단 맨 끝에 추가.', svg: treeSvg({ 6: RED }) });
    var i = 6;
    while (i > 0) {
      var p = (i - 1) >> 1;
      if (heap[p] >= heap[i]) break;
      var hl = {}; hl[p] = RED; hl[i] = RED;
      steps.push({ note: '부모 ' + heap[p] + ' &lt; ' + heap[i] + ' → 교환 (bubble-up)', svg: treeSvg(hl) });
      var t = heap[p]; heap[p] = heap[i]; heap[i] = t; i = p;
    }
    steps.push({ note: 'bubble-up 완료. 루트가 최댓값 15.', svg: treeSvg({ 0: RED }) });
    var max = heap[0], last = heap.pop();
    if (heap.length) heap[0] = last;
    steps.push({ note: '<b>extract-max</b>: 루트 ' + max + ' 반환, 마지막 원소 ' + last + '를 루트로.', svg: treeSvg({ 0: RED }) });
    var k = 0;
    for (;;) {
      var l = 2 * k + 1, r = 2 * k + 2, m = k;
      if (l < heap.length && heap[l] > heap[m]) m = l;
      if (r < heap.length && heap[r] > heap[m]) m = r;
      if (m === k) break;
      var hl2 = {}; hl2[k] = RED; hl2[m] = RED;
      steps.push({ note: '자식 ' + heap[m] + '이 더 큼 → 교환 (bubble-down)', svg: treeSvg(hl2) });
      var t2 = heap[k]; heap[k] = heap[m]; heap[m] = t2; k = m;
    }
    steps.push({ note: '힙 복원 완료. insert/extract 모두 O(log n).', svg: treeSvg(null) });
    player(root, '힙 연산 (insert · extract-max)', steps);
  });

  /* 5. DFS / BFS */
  function graphWidget(root, mode) {
    var adj = { A: ['B', 'C'], B: ['A', 'D', 'E'], C: ['A', 'F'], D: ['B'], E: ['B', 'F'], F: ['C', 'E'] };
    var pos = { A: [150, 30], B: [80, 90], C: [220, 90], D: [40, 155], E: [120, 155], F: [220, 155] };
    var seen = {}, order = [], steps = [];
    function gsvg(cur) {
      var s = svgOpen(280, 190), drawn = {};
      Object.keys(adj).forEach(function (u) {
        adj[u].forEach(function (v) {
          var key = [u, v].sort().join('');
          if (!drawn[key]) { drawn[key] = 1; s += '<line x1="' + pos[u][0] + '" y1="' + pos[u][1] + '" x2="' + pos[v][0] + '" y2="' + pos[v][1] + '" stroke="' + GRID + '" stroke-width="1.5"/>'; }
        });
      });
      Object.keys(pos).forEach(function (u) {
        var c = u === cur ? RED : (seen[u] ? INK : '#999');
        var fill = seen[u] ? FILL : '#fff';
        s += '<circle cx="' + pos[u][0] + '" cy="' + pos[u][1] + '" r="15" fill="' + fill + '" stroke="' + c + '" stroke-width="' + (u === cur ? 2.5 : 1.5) + '"/>';
        s += '<text x="' + pos[u][0] + '" y="' + (pos[u][1] + 4) + '" font-size="12" text-anchor="middle" fill="' + c + '">' + u + '</text>';
      });
      return s + '</svg>';
    }
    steps.push({ note: 'A에서 시작. ' + (mode === 'bfs' ? 'BFS는 큐(FIFO)로 <b>가까운 정점부터</b> 방문.' : 'DFS는 스택(LIFO)으로 <b>깊은 곳부터</b> 방문.'), svg: gsvg(null) });
    if (mode === 'bfs') {
      var q = ['A']; seen.A = true;
      while (q.length) {
        var u = q.shift(); order.push(u);
        steps.push({ note: '방문 <b>' + u + '</b> (큐: [' + q.join(', ') + ']) — 미방문 이웃을 큐에 추가', svg: gsvg(u) });
        adj[u].forEach(function (v) { if (!seen[v]) { seen[v] = true; q.push(v); } });
      }
    } else {
      var st = ['A'];
      while (st.length) {
        var u2 = st.pop();
        if (seen[u2]) continue;
        seen[u2] = true; order.push(u2);
        steps.push({ note: '방문 <b>' + u2 + '</b> (스택: [' + st.join(', ') + ']) — 이웃을 스택에 push', svg: gsvg(u2) });
        adj[u2].slice().reverse().forEach(function (v) { if (!seen[v]) st.push(v); });
      }
    }
    steps.push({ note: '방문 순서: <b>' + order.join(' → ') + '</b>. 둘 다 O(V+E), 자료구조(큐 vs 스택)만 다르다.', svg: gsvg(null) });
    player(root, mode === 'bfs' ? '너비 우선 탐색 (BFS)' : '깊이 우선 탐색 (DFS)', steps);
  }
  V6.register('graph-bfs', function (root) { graphWidget(root, 'bfs'); });
  V6.register('graph-dfs', function (root) { graphWidget(root, 'dfs'); });

  /* 6. Dijkstra */
  V6.register('dijkstra', function (root) {
    var nodes = ['A', 'B', 'C', 'D', 'E'];
    var pos = { A: [50, 90], B: [130, 30], C: [130, 150], D: [230, 60], E: [230, 140] };
    var edges = [['A', 'B', 4], ['A', 'C', 2], ['B', 'D', 5], ['C', 'B', 1], ['C', 'D', 8], ['C', 'E', 10], ['D', 'E', 2]];
    var adj = {}; nodes.forEach(function (u) { adj[u] = []; });
    edges.forEach(function (e) { adj[e[0]].push([e[1], e[2]]); adj[e[1]].push([e[0], e[2]]); });
    var dist = { A: 0, B: Infinity, C: Infinity, D: Infinity, E: Infinity }, done = {}, steps = [];
    function dsvg(cur) {
      var s = svgOpen(280, 185);
      edges.forEach(function (e) {
        s += '<line x1="' + pos[e[0]][0] + '" y1="' + pos[e[0]][1] + '" x2="' + pos[e[1]][0] + '" y2="' + pos[e[1]][1] + '" stroke="' + GRID + '" stroke-width="1.5"/>';
        s += '<text x="' + (pos[e[0]][0] + pos[e[1]][0]) / 2 + '" y="' + (pos[e[0]][1] + pos[e[1]][1]) / 2 - 3 + '" font-size="11" text-anchor="middle" fill="#777">' + e[2] + '</text>';
      });
      nodes.forEach(function (u) {
        var c = u === cur ? RED : (done[u] ? INK : '#999');
        s += '<circle cx="' + pos[u][0] + '" cy="' + pos[u][1] + '" r="15" fill="' + (done[u] ? FILL : '#fff') + '" stroke="' + c + '" stroke-width="' + (u === cur ? 2.5 : 1.5) + '"/>';
        s += '<text x="' + pos[u][0] + '" y="' + (pos[u][1] + 4) + '" font-size="12" text-anchor="middle" fill="' + c + '">' + u + '</text>';
        var d = dist[u] === Infinity ? '∞' : dist[u];
        s += '<text x="' + pos[u][0] + '" y="' + (pos[u][1] - 22) + '" font-size="11" text-anchor="middle" fill="' + (done[u] ? RED : '#555') + '">' + d + '</text>';
      });
      return s + '</svg>';
    }
    function dnote() {
      return nodes.map(function (u) { return u + '=' + (dist[u] === Infinity ? '∞' : dist[u]); }).join(' · ');
    }
    steps.push({ note: 'A에서 시작. dist[A]=0, 나머지 ∞. 매 단계 <b>미확정 정점 중 dist 최소</b>를 확정한다.<br>' + dnote(), svg: dsvg(null) });
    for (var iter = 0; iter < nodes.length; iter++) {
      var u = null, best = Infinity;
      nodes.forEach(function (n) { if (!done[n] && dist[n] < best) { best = dist[n]; u = n; } });
      if (u === null) break;
      done[u] = true;
      steps.push({ note: '<b>' + u + '</b> 확정 (dist=' + best + '). 이웃 완화(relax) 시도.', svg: dsvg(u) });
      adj[u].forEach(function (vw) {
        var v = vw[0], w = vw[1];
        if (!done[v] && dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          steps.push({ note: 'relax ' + u + '→' + v + ': dist[' + v + '] = ' + dist[u] + ' + ' + w + ' = <b>' + dist[v] + '</b><br>' + dnote(), svg: dsvg(v) });
        }
      });
    }
    steps.push({ note: '완료: ' + dnote() + '. 음수 간선이 없어야 옳다 (우선순위 큐 사용 시 O(E log V)).', svg: dsvg(null) });
    player(root, '다익스트라 최단 경로 (Dijkstra)', steps);
  });

  /* 7. DP: LCS */
  V6.register('dp-lcs', function (root) {
    var X = 'ABCBDAB', Y = 'BDCABA', m = X.length, n = Y.length;
    var dp = []; for (var i = 0; i <= m; i++) { dp.push([]); for (var j = 0; j <= n; j++) dp[i].push(i === 0 || j === 0 ? 0 : null); }
    var steps = [];
    function tsvg(ci, cj) {
      var cell = 34, s = svgOpen((n + 2) * cell + 20, (m + 2) * cell + 20);
      var labels = ' ' + Y, xl = ' ' + X;
      for (var r = 0; r <= m + 1; r++) for (var c = 0; c <= n + 1; c++) {
        var x = 10 + c * cell, y = 10 + r * cell;
        var isD = r > 0 && c > 0, cur = r - 1 === ci && c - 1 === cj;
        s += '<rect x="' + x + '" y="' + y + '" width="' + cell + '" height="' + cell + '" fill="' + (cur ? FILL : '#fff') + '" stroke="' + (cur ? RED : INK) + '" stroke-width="' + (cur ? 2.5 : 1) + '"/>';
        var ch = '';
        if (r === 0 && c === 0) ch = '';
        else if (r === 0) ch = xl[c - 1] || '';
        else if (c === 0) ch = labels[r - 1] || '';
        else if (dp[r - 1][c - 1] !== null) ch = dp[r - 1][c - 1];
        if (ch !== '') s += '<text x="' + (x + cell / 2) + '" y="' + (y + cell / 2 + 4) + '" font-size="12" text-anchor="middle" fill="' + (cur ? RED : INK) + '">' + ch + '</text>';
      }
      return s + '</svg>';
    }
    steps.push({ note: 'X=' + X + ', Y=' + Y + '. dp[i][j] = X 앞 i글자와 Y 앞 j글자의 LCS 길이. 0행·0열은 0.', svg: tsvg(-1, -1) });
    for (var i2 = 1; i2 <= m; i2++) for (var j2 = 1; j2 <= n; j2++) {
      if (X[i2 - 1] === Y[j2 - 1]) {
        dp[i2][j2] = dp[i2 - 1][j2 - 1] + 1;
        steps.push({ note: 'X[' + i2 + ']=' + X[i2 - 1] + ' = Y[' + j2 + ']=' + Y[j2 - 1] + ' → 대각선+1: dp[' + i2 + '][' + j2 + '] = ' + dp[i2][j2], svg: tsvg(i2, j2) });
      } else {
        dp[i2][j2] = Math.max(dp[i2 - 1][j2], dp[i2][j2 - 1]);
        steps.push({ note: X[i2 - 1] + ' ≠ ' + Y[j2 - 1] + ' → max(위 ' + dp[i2 - 1][j2] + ', 왼쪽 ' + dp[i2][j2 - 1] + ') = ' + dp[i2][j2], svg: tsvg(i2, j2) });
      }
    }
    steps.push({ note: 'LCS 길이 = <b>' + dp[m][n] + '</b>. 표 크기 O(mn), 각 칸 O(1).', svg: tsvg(m, n) });
    player(root, '동적 계획법: 최장 공통 부분수열 (LCS)', steps);
  });

  /* 8. DP: 0-1 Knapsack */
  V6.register('dp-knapsack', function (root) {
    var w = [1, 3, 4, 5], v = [1, 4, 5, 7], W = 7, n = w.length;
    var dp = []; for (var i = 0; i <= n; i++) { dp.push([]); for (var c = 0; c <= W; c++) dp[i].push(0); }
    var steps = [];
    function ksvg(ii, cc) {
      var cell = 30, s = svgOpen((W + 2) * cell + 40, (n + 2) * cell + 20);
      for (var r = 0; r <= n + 1; r++) for (var c = 0; c <= W + 1; c++) {
        var x = 30 + c * cell, y = 10 + r * cell;
        var cur = r - 1 === ii && c - 1 === cc;
        s += '<rect x="' + x + '" y="' + y + '" width="' + cell + '" height="' + cell + '" fill="' + (cur ? FILL : '#fff') + '" stroke="' + (cur ? RED : INK) + '" stroke-width="' + (cur ? 2.5 : 1) + '"/>';
        var ch = '';
        if (r === 0 && c === 0) ch = 'i\\w';
        else if (r === 0) ch = String(c - 1);
        else if (c === 0) ch = r - 1 >= 0 ? String(r - 1) : '';
        else ch = String(dp[r - 1][c - 1]);
        if (ch) s += '<text x="' + (x + cell / 2) + '" y="' + (y + cell / 2 + 4) + '" font-size="11" text-anchor="middle" fill="' + (cur ? RED : INK) + '">' + ch + '</text>';
      }
      return s + '</svg>';
    }
    steps.push({ note: '물건 i(무게 w, 가치 v): (1,1) (3,4) (4,5) (5,7). 배낭 용량 W=7. dp[i][c] = 앞 i개로 용량 c에서의 최대 가치.', svg: ksvg(-1, -1) });
    for (var i2 = 1; i2 <= n; i2++) for (var c2 = 1; c2 <= W; c2++) {
      if (w[i2 - 1] > c2) {
        dp[i2][c2] = dp[i2 - 1][c2];
        steps.push({ note: '물건 ' + i2 + '(w=' + w[i2 - 1] + ')은 용량 ' + c2 + '에 못 넣음 → 위 값 ' + dp[i2][c2] + ' 복사', svg: ksvg(i2, c2) });
      } else {
        dp[i2][c2] = Math.max(dp[i2 - 1][c2], v[i2 - 1] + dp[i2 - 1][c2 - w[i2 - 1]]);
        steps.push({ note: '물건 ' + i2 + ': max(안 넣음 ' + dp[i2 - 1][c2] + ', 넣음 ' + v[i2 - 1] + '+' + dp[i2 - 1][c2 - w[i2 - 1]] + ') = <b>' + dp[i2][c2] + '</b>', svg: ksvg(i2, c2) });
      }
    }
    steps.push({ note: '최대 가치 = <b>' + dp[n][W] + '</b> (최적 조합: 물건 2+3, 무게 3+4=7, 가치 4+5=9 — 표 역추적으로 확인 가능). O(nW)는 유사다항식 시간.', svg: ksvg(n, W) });
    player(root, '동적 계획법: 0-1 배낭 (Knapsack)', steps);
  });

  /* 9. 재귀 트리: 병합 정렬 T(n)=2T(n/2)+cn */
  V6.register('recursion-tree', function (root) {
    var steps = [];
    function levelSvg(levels) {
      var bw = 58, gap = 12, maxCnt = Math.pow(2, levels - 1);
      var w = Math.max(440, maxCnt * (bw + gap) + 150);
      var field = w - 150;
      var s = svgOpen(w, 46 + levels * 62 + 16);
      for (var L = 0; L < levels; L++) {
        var cnt = Math.pow(2, L), y = 36 + L * 62, span = field / cnt;
        for (var k = 0; k < cnt; k++) {
          var x = 12 + span * k + span / 2;
          s += '<rect x="' + (x - bw / 2) + '" y="' + (y - 15) + '" width="' + bw + '" height="28" fill="#fff" stroke="' + INK + '" stroke-width="1.2"/>';
          s += '<text x="' + x + '" y="' + (y + 4) + '" font-size="12" text-anchor="middle" fill="' + INK + '">cn/' + Math.pow(2, L) + '</text>';
          if (L > 0) { var pspan = field / (cnt / 2); var px = 12 + pspan * (k >> 1) + pspan / 2; s += '<line x1="' + px + '" y1="' + (y - 62 + 13) + '" x2="' + x + '" y2="' + (y - 15) + '" stroke="' + GRID + '"/>'; }
        }
        s += '<text x="' + (w - 14) + '" y="' + (y + 4) + '" font-size="12" text-anchor="end" fill="' + RED + '">= cn</text>';
      }
      return s + '</svg>';
    }
    steps.push({ note: 'T(n) = 2T(n/2) + cn. 각 노드는 부분 문제의 비재귀 작업량.', svg: levelSvg(1) });
    steps.push({ note: '레벨 1: 두 개의 T(n/2), 각각 cn/2의 작업. 레벨 합은 여전히 cn.', svg: levelSvg(2) });
    steps.push({ note: '레벨 2: 네 개의 T(n/4), 각 cn/4. 레벨 합 cn.', svg: levelSvg(3) });
    steps.push({ note: '레벨 k마다 합이 cn이고, 깊이는 log₂n. 총합 = cn·(log₂n + 1) → <b>T(n) = Θ(n log n)</b>.', svg: levelSvg(4) });
    player(root, '재귀 트리: 병합 정렬의 점화식', steps);
  });

  /* 10. 복잡도 성장 곡선 (캔버스) */
  V6.register('complexity-curves', function (root, cfg) {
    var W = 420, H = 240;
    var cv = (window.V6 && V6.canvas) ? V6.canvas(root, H) : (function () { var c = h('canvas', null, root); c.width = W; c.height = H; c.style.cssText = 'border:1px solid ' + INK + ';background:#fff'; return c; })();
    cv.width = W; cv.height = H;
    var ctx = cv.getContext('2d');
    var xr = [1, 32], yr = [0, 160];
    var fns = [
      { f: function (n) { return Math.log2(n); }, label: 'log n', dash: [] },
      { f: function (n) { return n; }, label: 'n', dash: [6, 3] },
      { f: function (n) { return n * Math.log2(n); }, label: 'n log n', dash: [] },
      { f: function (n) { return n * n; }, label: 'n²', dash: [2, 2] }
    ];
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var ax = (window.V6 && V6.axes) ? V6.axes(ctx, W, H, xr, yr) : null;
      var px = ax ? ax.px : function (x) { return 40 + (x - xr[0]) / (xr[1] - xr[0]) * (W - 60); };
      var py = ax ? ax.py : function (y) { return H - 30 - (y - yr[0]) / (yr[1] - yr[0]) * (H - 50); };
      ctx.strokeStyle = INK; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px(xr[0]), py(0)); ctx.lineTo(px(xr[1]), py(0)); ctx.moveTo(px(xr[0]), py(0)); ctx.lineTo(px(xr[0]), py(yr[1])); ctx.stroke();
      ctx.fillStyle = '#555'; ctx.font = '11px sans-serif';
      ctx.fillText('n →', px(xr[1]) - 24, py(0) + 16); ctx.fillText('시간', px(xr[0]) - 30, py(yr[1]) + 4);
      fns.forEach(function (fn, idx) {
        ctx.strokeStyle = idx === 2 ? RED : INK; ctx.setLineDash(fn.dash); ctx.lineWidth = idx === 2 ? 2 : 1.4; ctx.beginPath();
        for (var n = 1; n <= 32; n += 0.5) { var y = fn.f(n); var X = px(n), Y = py(Math.min(y, yr[1])); if (n === 1) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
        ctx.stroke(); ctx.setLineDash([]);
      });
      ctx.font = '12px sans-serif';
      fns.forEach(function (fn, idx) { ctx.fillStyle = idx === 2 ? RED : INK; ctx.fillText(fn.label, W - 66, 24 + idx * 16); });
    }
    if (window.V6 && V6.title) V6.title(root, '시간 복잡도 성장 비교');
    draw();
    var cap = h('div', null, root); cap.style.cssText = 'font-size:12px;color:#555;margin-top:4px';
    cap.textContent = '같은 n에서 n log n(빨강)은 n²보다 훨씬 천천히 자란다 — 큰 입력일수록 정렬 알고리즘 선택이 중요해지는 이유.';
  });

  /* 11. 그리디: 활동 선택 */
  V6.register('greedy-activity', function (root) {
    var acts = [[1, 4], [3, 5], [0, 6], [5, 7], [3, 9], [5, 9], [6, 10], [8, 11], [8, 12], [2, 14], [12, 16]];
    acts.sort(function (a, b) { return a[1] - b[1]; });
    var steps = [];
    function asvg(sel, cur) {
      var s = svgOpen(380, 30 + acts.length * 24 + 10);
      for (var x = 0; x <= 16; x += 2) { s += '<text x="' + (20 + x * 21) + '" y="14" font-size="10" text-anchor="middle" fill="#999">' + x + '</text>'; }
      acts.forEach(function (a, i) {
        var y = 24 + i * 24, c = sel.indexOf(i) >= 0 ? RED : (i === cur ? RED : INK);
        var dash = sel.indexOf(i) >= 0 || i === cur ? '' : ' stroke-dasharray="3,2" opacity="0.45"';
        s += '<line x1="' + (20 + a[0] * 21) + '" y1="' + y + '" x2="' + (20 + a[1] * 21) + '" y2="' + y + '" stroke="' + c + '" stroke-width="' + (sel.indexOf(i) >= 0 ? 3.5 : 2) + '"' + dash + '/>';
      });
      return s + '</svg>';
    }
    steps.push({ note: '활동 11개 (시작, 끝). <b>종료 시각이 빠른 순</b>으로 정렬해 둔 상태. 그리디 선택: 매번 가장 일찍 끝나는 호환 활동을 고른다.', svg: asvg([], -1) });
    var sel = [], lastEnd = -1;
    acts.forEach(function (a, i) {
      if (a[0] >= lastEnd) {
        sel.push(i); lastEnd = a[1];
        steps.push({ note: '선택 [' + a[0] + ', ' + a[1] + '] — 가장 일찍 끝나는 호환 활동. 다음 커트라인: 시작 ≥ ' + a[1], svg: asvg(sel, i) });
      }
    });
    steps.push({ note: '최대 <b>' + sel.length + '개</b> 선택. 종료 시각 정렬 + 순회 = O(n log n). 최적성: 교환 논증(exchange argument)으로 증명.', svg: asvg(sel, -1) });
    player(root, '그리디: 활동 선택 문제', steps);
  });

  /* 12. 이진 탐색 */
  V6.register('binary-search', function (root) {
    var a = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], target = 23, steps = [];
    var lo = 0, hi = a.length - 1;
    function bs() {
      var s = svgOpen(a.length * 44 + 20, 100);
      for (var i = 0; i < a.length; i++) {
        var inR = i >= lo && i <= hi, c = inR ? INK : '#bbb';
        s += '<rect x="' + (12 + i * 44) + '" y="30" width="32" height="32" fill="' + (inR ? '#fff' : FILL) + '" stroke="' + c + '" stroke-width="1.5"/>';
        s += '<text x="' + (28 + i * 44) + '" y="51" font-size="12" text-anchor="middle" fill="' + c + '">' + a[i] + '</text>';
      }
      function ptr(i, label, color) { return '<text x="' + (28 + i * 44) + '" y="80" font-size="11" text-anchor="middle" fill="' + color + '" font-weight="bold">' + label + '</text><line x1="' + (28 + i * 44) + '" y1="64" x2="' + (28 + i * 44) + '" y2="70" stroke="' + color + '" stroke-width="2"/>'; }
      if (lo <= hi) { s += ptr(lo, 'lo', INK); s += ptr(hi, 'hi', INK); s += ptr((lo + hi) >> 1, 'mid', RED); }
      return s + '</svg>';
    }
    steps.push({ note: '정렬된 배열에서 <b>' + target + '</b> 찾기. 매번 가운데(mid)와 비교해 탐색 구간을 반으로 줄인다.', svg: bs() });
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      if (a[mid] === target) {
        steps.push({ note: 'a[' + mid + '] = ' + a[mid] + ' = 목표. <b>찾음 (인덱스 ' + mid + ')</b>. 단계 수 ≈ log₂n.', svg: bs() });
        break;
      } else if (a[mid] < target) {
        steps.push({ note: 'a[' + mid + '] = ' + a[mid] + ' &lt; ' + target + ' → 왼쪽 절반 버림 (lo = mid+1)', svg: bs() });
        lo = mid + 1;
      } else {
        steps.push({ note: 'a[' + mid + '] = ' + a[mid] + ' &gt; ' + target + ' → 오른쪽 절반 버림 (hi = mid-1)', svg: bs() });
        hi = mid - 1;
      }
    }
    player(root, '이진 탐색 (Binary Search)', steps);
  });
})();
