// CDN版React用（import不要）
const { useState, useEffect, useRef } = React;

// 数式レンダリングコンポーネント（MathJax版）
function MathFormula({ children, display = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([ref.current]).catch(() => {});
    }
  }, [children]);

  // \displaystyle で分数を大きく表示
  const content = `\\displaystyle ${children}`;
  const tex = display ? `\\[${content}\\]` : `\\(${content}\\)`;

  return <span ref={ref} className={display ? "math-display" : "math-inline"}>{tex}</span>;
}

// ===== データ定義 =====
const sections = [
  {
    id: 1,
    title: "条件付き確率とベイズの定理",
    icon: "🎯",
    color: "#ff6b6b",
    theory: {
      background: "ベイズの定理は「結果から原因を推定する」逆確率の問題を解くための基礎。機械学習や意思決定論における最重要概念の一つ。",
      keyInsight: "全確率の定理は、標本空間を排反な事象に分割し、各経路を通じて目的の事象が発生する確率を合算するアプローチ。",
      commonMistakes: [
        "P(A|B) ≠ P(B|A) を混同する（順序が違うと全く別の確率）",
        "パーセンテージを小数に変換する際の桁数ミス（0.4% → 0.004）",
        "ベイズの定理で分母P(E)の計算を忘れる"
      ]
    },
    concepts: [
      "条件付き確率P(E|A)は「Aが起きた条件のもとでEが起きる確率」",
      "ベイズの定理は「結果から原因を推定する」ための公式",
      "全確率の法則は排反な事象に分解して全体の確率を求める",
      "P(Aᵢ)は事前確率(Prior)、P(E|Aᵢ)は尤度(Likelihood)と呼ばれる",
    ],
    formulas: [
      { name: "条件付き確率", formula: "P(E|A) = \\frac{P(A \\cap E)}{P(A)}", note: "Aが起きた条件でEが起きる確率", importance: 3 },
      { name: "乗法定理", formula: "P(A \\cap E) = P(A) \\times P(E|A)", note: "同時確率を求める基本公式", importance: 3 },
      { name: "全確率の法則", formula: "P(E) = \\sum_i P(A_i)P(E|A_i)", note: "排反な事象で分解", importance: 3 },
      { name: "ベイズの定理", formula: "P(A|E) = \\frac{P(A)P(E|A)}{P(E)}", note: "結果から原因を推定", importance: 3 },
      { name: "ベイズ展開形", formula: "P(A|E) = \\frac{P(A)P(E|A)}{\\sum_i P(A_i)P(E|A_i)}", note: "分母を全確率で展開", importance: 2 },
    ],
    procedure: [
      "Step 1: 文章題から事前確率P(Aᵢ)と条件付き確率P(E|Aᵢ)を抽出する",
      "Step 2: 各経路の積事象P(Aᵢ∩E) = P(Aᵢ)×P(E|Aᵢ)を計算する",
      "Step 3: それらを合計して周辺確率P(E)（分母）を求める",
      "Step 4: 該当する経路の確率を分子とし、比率（事後確率）を計算する",
      "Check: 確率の合計が1になることを確認"
    ],
    problems: [
      {
        question: "A社、B社、C社から部品を購入。納品割合はA:15%, B:35%, C:50%。不良品率はA:0.4%, B:0.4%, C:0.2%。全体の不良品率P(E)を求めよ。",
        hint: "P(E) = P(A)P(E|A) + P(B)P(E|B) + P(C)P(E|C)",
        solution: "【パラメータ整理】\nP(A)=0.15, P(B)=0.35, P(C)=0.50\nP(E|A)=0.004, P(E|B)=0.004, P(E|C)=0.002\n\n【各経路の寄与】\nP(A∩E) = 0.15×0.004 = 0.0006\nP(B∩E) = 0.35×0.004 = 0.0014\nP(C∩E) = 0.50×0.002 = 0.0010\n\n【合計】\nP(E) = 0.0006 + 0.0014 + 0.0010 = 0.003",
        answer: "0.003 (0.3%)",
        insight: "C社はシェア50%だが品質が高いため、不良品への寄与(0.001)はB社(0.0014)より小さい"
      },
      {
        question: "上記の問題で、不良品がA社製である確率P(A|E)を求めよ。",
        hint: "ベイズの定理: P(A|E) = P(A∩E) / P(E)",
        solution: "【ベイズの定理適用】\nP(A|E) = P(A∩E) / P(E)\n= 0.0006 / 0.003\n= 0.2 = 1/5\n\n【解釈】\n元のシェア15%が、不良品という情報で20%に上昇。\nA社の不良品率(0.4%)が平均(0.3%)より高いため、\n疑いの度合いが増した。",
        answer: "1/5 (20%)",
        insight: "事前確率15%→事後確率20%への更新がベイズ推定の本質"
      },
      {
        question: "病気Xの発症率は1%。検査精度は、病気の人を陽性と判定95%、健康な人を陰性と判定90%。陽性判定された人が実際に病気である確率は？",
        hint: "偽陽性(健康なのに陽性)の影響を考慮",
        solution: "【パラメータ】\nP(病気)=0.01, P(健康)=0.99\nP(陽性|病気)=0.95, P(陽性|健康)=0.10\n\n【全確率】\nP(陽性) = 0.01×0.95 + 0.99×0.10\n= 0.0095 + 0.099 = 0.1085\n\n【ベイズの定理】\nP(病気|陽性) = 0.0095/0.1085 ≈ 0.0876",
        answer: "約8.76%",
        insight: "陽性でも実際に病気の確率は約9%！偽陽性の影響が大きい典型例"
      },
      {
        question: "袋Aに赤3白2、袋Bに赤2白4。コイン表→A、裏→Bから取り出す。赤が出たとき、袋Aからの確率は？",
        hint: "P(A|赤) = P(A∩赤) / P(赤)",
        solution: "【設定】\nP(A)=P(B)=0.5\nP(赤|A)=3/5, P(赤|B)=2/6=1/3\n\n【全確率】\nP(赤) = 0.5×(3/5) + 0.5×(1/3)\n= 3/10 + 1/6 = 9/30 + 5/30 = 14/30 = 7/15\n\n【ベイズ】\nP(A∩赤) = 0.5×(3/5) = 3/10 = 9/30\nP(A|赤) = (9/30)/(14/30) = 9/14",
        answer: "9/14",
        insight: "袋Aの方が赤が多いので、赤が出ると袋Aの確率が上がる"
      },
      {
        question: "3枚のカード：両面赤、両面青、片面赤青。1枚引いて赤が見えた。裏も赤の確率は？",
        hint: "「赤い面」の数で考える（カードの数ではない）",
        solution: "【赤い面は全部で3面】\n・両面赤カードの表面 → 裏は赤\n・両面赤カードの裏面 → 表は赤\n・片面赤青の赤面 → 裏は青\n\n【確率計算】\n赤が見える3通り中、裏も赤は2通り\nP = 2/3",
        answer: "2/3",
        insight: "直感的には1/2と思いがちだが、両面赤は2面あるので2/3が正解"
      },
      {
        question: "工場の機械A,Bの生産比率6:4。不良品率A:2%, B:5%。不良品が機械Bの製品である確率は？",
        hint: "ベイズの定理を適用",
        solution: "【パラメータ】\nP(A)=0.6, P(B)=0.4\nP(不良|A)=0.02, P(不良|B)=0.05\n\n【全確率】\nP(不良) = 0.6×0.02 + 0.4×0.05\n= 0.012 + 0.020 = 0.032\n\n【ベイズ】\nP(B|不良) = (0.4×0.05)/0.032\n= 0.020/0.032 = 5/8",
        answer: "5/8 = 0.625",
        insight: "Bはシェア40%だが不良品率が高いため、不良品の62.5%がB由来"
      }
    ]
  },
  {
    id: 2,
    title: "期待値と分散",
    icon: "📊",
    color: "#4ecdc4",
    theory: {
      background: "期待値は確率変数の「重心」、分散は「散らばり具合」を表す。これらは記述統計の基礎であると同時に、推測統計の土台となる重要概念。",
      keyInsight: "分散の計算公式 V[X]=E[X²]−(E[X])² は、偏差を一つ一つ計算する手間を省き、計算ミスを大幅に低減できる。",
      commonMistakes: [
        "V[aX+b]=a²V[X] で定数bは消える（散らばりは平行移動で変わらない）",
        "V[X+Y]=V[X]+V[Y] は独立な場合のみ成立",
        "E[X²] ≠ (E[X])² を混同する"
      ]
    },
    concepts: [
      "期待値E[X]は確率変数の「重み付き平均」で、分布の重心を表す",
      "分散V[X]は「散らばり具合」を表し、常に0以上",
      "標準偏差σ = √V[X]で、元のデータと同じ単位になる",
      "線形変換で分散の定数項は消える（重要！）",
    ],
    formulas: [
      { name: "期待値", formula: "E[X] = \\sum_x x \\cdot P(X=x)", note: "離散型の定義", importance: 3 },
      { name: "分散（定義）", formula: "V[X] = E[(X-\\mu)^2]", note: "偏差の2乗の期待値", importance: 2 },
      { name: "分散（計算用）", formula: "V[X] = E[X^2] - (E[X])^2", note: "★計算はこれを使う", importance: 3 },
      { name: "標準偏差", formula: "\\sigma = \\sqrt{V[X]}", note: "分散の平方根", importance: 2 },
      { name: "期待値の線形性", formula: "E[aX+b] = aE[X]+b", note: "そのまま係数が出る", importance: 3 },
      { name: "分散の線形性", formula: "V[aX+b] = a^2 V[X]", note: "★係数は2乗、bは消える", importance: 3 },
      { name: "独立な和の分散", formula: "V[X+Y] = V[X]+V[Y]", note: "独立のときのみ", importance: 3 },
    ],
    procedure: [
      "Step 1: 確率分布表を作成（x, P(X=x)の対応）",
      "Step 2: E[X] = Σx·P(x) を計算",
      "Step 3: E[X²] = Σx²·P(x) を計算",
      "Step 4: V[X] = E[X²] − (E[X])² で分散を求める",
      "Check: 分散が負になっていないか確認"
    ],
    problems: [
      {
        question: "確率変数Xの分布が X=1,2,3,4 でP=0.1,0.2,0.3,0.4のとき、E[X], E[X²], V[X]を求めよ。",
        hint: "E[X]=Σx·P(x), V[X]=E[X²]−(E[X])²",
        solution: "【期待値】\nE[X] = 1×0.1 + 2×0.2 + 3×0.3 + 4×0.4\n= 0.1 + 0.4 + 0.9 + 1.6 = 3.0\n\n【2乗の期待値】\nE[X²] = 1²×0.1 + 2²×0.2 + 3²×0.3 + 4²×0.4\n= 0.1 + 0.8 + 2.7 + 6.4 = 10.0\n\n【分散】\nV[X] = 10.0 − 3² = 10 − 9 = 1",
        answer: "E[X]=3, E[X²]=10, V[X]=1",
        insight: "通常の4面サイコロ(期待値2.5)より大きい値が出やすい歪んだ分布"
      },
      {
        question: "上記のXに対して、Z=2X+3のとき、E[Z]とV[Z]を求めよ。",
        hint: "E[aX+b]=aE[X]+b, V[aX+b]=a²V[X]",
        solution: "【期待値の線形性】\nE[Z] = E[2X+3] = 2E[X] + 3\n= 2×3 + 3 = 9\n\n【分散の線形性】\nV[Z] = V[2X+3] = 2²×V[X]\n= 4×1 = 4\n\n★ポイント：+3は分散に影響しない！",
        answer: "E[Z]=9, V[Z]=4",
        insight: "定数を足しても散らばり具合は変わらない（平行移動）"
      },
      {
        question: "サイコロを1回振ったときの出目Xの期待値と分散を求めよ。",
        hint: "各目が1/6の確率で出る",
        solution: "【期待値】\nE[X] = (1+2+3+4+5+6)/6 = 21/6 = 3.5\n\n【2乗の期待値】\nE[X²] = (1+4+9+16+25+36)/6 = 91/6\n\n【分散】\nV[X] = 91/6 − (7/2)²\n= 91/6 − 49/4\n= 182/12 − 147/12 = 35/12 ≈ 2.917",
        answer: "E[X]=3.5, V[X]=35/12≈2.92",
        insight: "この値は二項分布やサンプリングの問題で頻出"
      },
      {
        question: "サイコロを2回振り、出た目の合計をSとする。E[S]とV[S]を求めよ。",
        hint: "S = X₁ + X₂、独立な確率変数の和",
        solution: "【期待値の加法性】\nE[S] = E[X₁] + E[X₂] = 3.5 + 3.5 = 7\n\n【独立な変数の分散】\nV[S] = V[X₁] + V[X₂]\n= 35/12 + 35/12 = 70/12 = 35/6 ≈ 5.83",
        answer: "E[S]=7, V[S]=35/6≈5.83",
        insight: "独立なので分散は単純に足せる"
      },
      {
        question: "X, Yは独立でE[X]=2, E[Y]=3, V[X]=1, V[Y]=2のとき、Z=3X-2Y+5の期待値と分散は？",
        hint: "V[aX-bY]=a²V[X]+b²V[Y]（独立時）",
        solution: "【期待値】\nE[Z] = 3E[X] - 2E[Y] + 5\n= 3×2 - 2×3 + 5 = 6 - 6 + 5 = 5\n\n【分散】（独立なので）\nV[Z] = 3²V[X] + (-2)²V[Y]\n= 9×1 + 4×2 = 9 + 8 = 17\n\n★引き算でも分散は足す！",
        answer: "E[Z]=5, V[Z]=17",
        insight: "V[X-Y]=V[X]+V[Y]（独立時）、引き算でも分散は加算"
      },
      {
        question: "E[X]=5, V[X]=4のとき、Y=(X-5)/2の期待値と分散を求めよ。",
        hint: "Y = (1/2)X - 5/2 と変形",
        solution: "【変形】\nY = (1/2)X - 5/2\n\n【期待値】\nE[Y] = (1/2)×5 - 5/2 = 5/2 - 5/2 = 0\n\n【分散】\nV[Y] = (1/2)²×4 = (1/4)×4 = 1",
        answer: "E[Y]=0, V[Y]=1",
        insight: "これは標準化！平均0、分散1に変換している"
      }
    ]
  },
  {
    id: 3,
    title: "偏差値と基本的な分布",
    icon: "📈",
    color: "#a55eea",
    theory: {
      background: "偏差値は日本独自の教育統計指標で、標準化(Z変換)後に線形変換を施したもの。幾何分布と二項分布は同じベルヌーイ試行を扱うが、固定するものが違う。",
      keyInsight: "幾何分布は「試行回数が変数」、二項分布は「成功回数が変数」という対照的な関係。この対比が確率モデルの適切な選択につながる。",
      commonMistakes: [
        "偏差値の公式でσは標準偏差（分散ではない！）",
        "幾何分布のE[X]=1/pは「成功確率の逆数」",
        "二項分布でC(n,k)の計算ミス",
        "np(1-p)の(1-p)を忘れがち"
      ]
    },
    concepts: [
      "偏差値は平均50、標準偏差10になるように標準化した値",
      "標準化Z=(X-μ)/σで、単位の異なるデータを比較可能にする",
      "幾何分布は「初めて成功するまでの試行回数」の分布",
      "二項分布は「n回中の成功回数」の分布",
    ],
    formulas: [
      { name: "標準化(Zスコア)", formula: "Z = \\frac{X-\\mu}{\\sigma}", note: "平均0、分散1に変換", importance: 3 },
      { name: "偏差値", formula: "T = 10Z + 50 = \\frac{10(X-m)}{\\sigma} + 50", note: "平均50、標準偏差10に変換", importance: 3 },
      { name: "幾何分布の確率", formula: "P(X=k) = (1-p)^{k-1} \\cdot p", note: "k回目に初成功", importance: 2 },
      { name: "幾何分布の期待値", formula: "E[X] = \\frac{1}{p}", note: "★成功確率の逆数", importance: 3 },
      { name: "幾何分布の分散", formula: "V[X] = \\frac{1-p}{p^2}", note: "忘れやすい！", importance: 2 },
      { name: "二項分布の確率", formula: "P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}", note: "", importance: 3 },
      { name: "二項分布の期待値", formula: "E[X] = np", note: "★最頻出", importance: 3 },
      { name: "二項分布の分散", formula: "V[X] = np(1-p)", note: "★最頻出", importance: 3 },
    ],
    procedure: [
      "【偏差値計算】",
      "Step 1: 標準偏差σ=√分散を求める",
      "Step 2: Z=(X-平均)/σで標準化",
      "Step 3: T=10Z+50で偏差値に変換",
      "【二項分布】",
      "Step 1: 成功確率pと試行回数nを特定",
      "Step 2: C(n,k)=n!/(k!(n-k)!)を計算",
      "Step 3: pᵏ(1-p)ⁿ⁻ᵏを計算して掛ける"
    ],
    problems: [
      {
        question: "試験の平均が70点、分散が36のとき、66点の人の偏差値を求めよ。",
        hint: "標準偏差σ=√分散、偏差値=10(X-m)/σ+50",
        solution: "【標準偏差】\nσ = √36 = 6\n\n【標準化】\nZ = (66-70)/6 = -4/6 = -0.667\n\n【偏差値】\nT = 10×(-0.667) + 50\n= -6.67 + 50 = 43.33",
        answer: "43.3",
        insight: "平均より4点低い→偏差値で約6.7ポイント低い"
      },
      {
        question: "偏差値60の人は、平均からどれだけ上か（標準偏差の何倍か）？",
        hint: "偏差値の式を逆に解く",
        solution: "【偏差値の式】\n60 = 10Z + 50\n10 = 10Z\nZ = 1\n\n【意味】\nZ=1は「平均+1σの位置」",
        answer: "平均より標準偏差1つ分上（上位約16%）",
        insight: "偏差値60≒上位16%、偏差値70≒上位2.3%"
      },
      {
        question: "サイコロを振り、初めて6が出るまでの回数Xの期待値と分散を求めよ。",
        hint: "幾何分布 Ge(1/6)",
        solution: "【パラメータ】\np = 1/6（6が出る確率）\n\n【期待値】\nE[X] = 1/p = 1/(1/6) = 6\n\n【分散】\nV[X] = (1-p)/p²\n= (5/6)/(1/36)\n= (5/6)×36 = 30",
        answer: "E[X]=6回, V[X]=30",
        insight: "確率1/6の事象は平均6回で発生"
      },
      {
        question: "サイコロを4回振り、3の倍数が出る回数Yについて、P(Y=3)とP(Y≧3)を求めよ。",
        hint: "3の倍数(3,6)の確率は2/6=1/3",
        solution: "【パラメータ】\nn=4, p=1/3\nY ~ B(4, 1/3)\n\n【P(Y=3)】\nP(Y=3) = C(4,3)×(1/3)³×(2/3)¹\n= 4×(1/27)×(2/3) = 8/81\n\n【P(Y=4)】\nP(Y=4) = C(4,4)×(1/3)⁴×(2/3)⁰\n= 1×(1/81)×1 = 1/81\n\n【P(Y≧3)】\nP(Y≧3) = 8/81 + 1/81 = 9/81 = 1/9",
        answer: "P(Y=3)=8/81, P(Y≧3)=1/9",
        insight: "累積確率は個別確率を足す"
      },
      {
        question: "コインを10回投げて表が出る回数をXとする。P(X=5)を求めよ。",
        hint: "X ~ B(10, 0.5)",
        solution: "【パラメータ】\nn=10, p=0.5\n\n【計算】\nP(X=5) = C(10,5)×(0.5)⁵×(0.5)⁵\n= C(10,5)×(0.5)¹⁰\n\n【組合せ計算】\nC(10,5) = 10!/(5!×5!) = 252\n\n【結果】\nP(X=5) = 252/1024 = 63/256 ≈ 0.246",
        answer: "63/256 ≈ 0.246",
        insight: "公平なコインでも5回表の確率は約25%"
      },
      {
        question: "二項分布B(100, 0.3)の期待値と分散を求めよ。",
        hint: "E[X]=np, V[X]=np(1-p)",
        solution: "【期待値】\nE[X] = np = 100×0.3 = 30\n\n【分散】\nV[X] = np(1-p)\n= 100×0.3×0.7 = 21\n\n【標準偏差】\nσ = √21 ≈ 4.58",
        answer: "E[X]=30, V[X]=21, σ≈4.58",
        insight: "100回中平均30回成功、±4.58程度のばらつき"
      }
    ]
  },
  {
    id: 4,
    title: "正規分布・ポアソン分布・指数分布",
    icon: "🔔",
    color: "#f7b731",
    theory: {
      background: "正規分布は連続型確率分布の代表。ポアソン分布は「単位時間あたりの発生件数」、指数分布は「事象間の時間間隔」をモデル化し、両者は表裏一体の関係。",
      keyInsight: "ポアソン過程において、「件数はポアソン分布、間隔は指数分布」という双対性は待ち行列理論や信頼性工学の基礎。",
      commonMistakes: [
        "N(μ, σ²)の2番目は「分散」（標準偏差ではない！）",
        "標準化で σ² ではなく σ で割る",
        "ポアソン分布は E[X] = V[X] = λ（期待値と分散が等しい）",
        "指数分布の期待値E[Y]=1/λを忘れる"
      ]
    },
    concepts: [
      "正規分布N(μ,σ²)は平均μ、分散σ²の連続分布",
      "標準正規分布N(0,1)は平均0、分散1の正規分布",
      "ポアソン分布Po(λ)は「単位時間あたり平均λ回」の発生回数",
      "指数分布は「事象間の時間間隔」を表し、期待値は1/λ",
    ],
    formulas: [
      { name: "標準化", formula: "Z = \\frac{X-\\mu}{\\sigma}", note: "★最重要公式！", importance: 3 },
      { name: "正規分布の表記", formula: "X \\sim N(\\mu, \\sigma^2)", note: "第2パラメータは分散", importance: 2 },
      { name: "ポアソン分布の確率", formula: "P(X=k) = \\frac{e^{-\\lambda} \\cdot \\lambda^k}{k!}", note: "λは平均発生数", importance: 3 },
      { name: "ポアソンの期待値・分散", formula: "E[X] = V[X] = \\lambda", note: "★期待値=分散", importance: 3 },
      { name: "指数分布の期待値", formula: "E[Y] = \\frac{1}{\\lambda}", note: "平均間隔", importance: 3 },
      { name: "指数分布の分散", formula: "V[Y] = \\frac{1}{\\lambda^2}", note: "", importance: 2 },
      { name: "指数分布の累積", formula: "P(Y \\leq t) = 1 - e^{-\\lambda t}", note: "時刻tまでに発生", importance: 2 },
    ],
    procedure: [
      "【正規分布の確率計算】",
      "Step 1: Z=(X-μ)/σで標準化",
      "Step 2: 標準正規分布表でP(Z≥z)を読む",
      "Step 3: 対称性P(Z≤-a)=P(Z≥a)を活用",
      "【ポアソン分布】",
      "Step 1: 単位時間あたりの平均λを特定",
      "Step 2: P(X=k)=e⁻λ·λᵏ/k!で計算",
      "Step 3: 累積はP(X≤n)=Σ P(X=k)で足す"
    ],
    problems: [
      {
        question: "X ~ N(3, 4)のとき、Xを標準化した確率変数Zを求めよ。",
        hint: "σ² = 4 なので σ = 2",
        solution: "【パラメータ読み取り】\nN(3, 4)より μ=3, σ²=4\nよって σ = √4 = 2\n\n【標準化】\nZ = (X - μ)/σ = (X - 3)/2",
        answer: "Z = (X−3)/2",
        insight: "σ²=4とσ=4を混同しないこと"
      },
      {
        question: "1時間に平均3件のメールが届く。2件以下届く確率を求めよ（e⁻³=0.05）。",
        hint: "ポアソン分布 Po(3)を使う",
        solution: "【ポアソン分布】\nX ~ Po(3), λ=3\n\n【各確率】\nP(X=0) = e⁻³×3⁰/0! = e⁻³×1 = 0.05\nP(X=1) = e⁻³×3¹/1! = 0.05×3 = 0.15\nP(X=2) = e⁻³×3²/2! = 0.05×4.5 = 0.225\n\n【累積】\nP(X≤2) = 0.05 + 0.15 + 0.225 = 0.425",
        answer: "0.4（小数第1位）",
        insight: "e⁻³≈0.05は暗記推奨"
      },
      {
        question: "上記の問題で、メール間の時間間隔Yの期待値と従う分布を答えよ。",
        hint: "ポアソン過程の間隔は指数分布に従う",
        solution: "【ポアソンと指数の関係】\n1時間に平均3件 → λ = 3\n\n【指数分布のパラメータ】\n間隔の平均 E[Y] = 1/λ = 1/3時間 = 20分\n\n【分布】\nYは指数分布Exp(λ=3)に従う",
        answer: "E[Y]=1/3時間(20分), 指数分布Exp(3)",
        insight: "「件数のλ」と「間隔の期待値」は逆数関係"
      },
      {
        question: "X ~ N(μ, σ²)のとき、Y = 2X + 3 はどのような分布に従うか。",
        hint: "正規分布の線形変換は正規分布（再生性）",
        solution: "【正規分布の線形変換】\n正規分布の線形変換もまた正規分布\n\n【パラメータ】\nE[Y] = 2μ + 3\nV[Y] = 2²σ² = 4σ²\n\n【結果】\nY ~ N(2μ+3, 4σ²)",
        answer: "N(2μ+3, 4σ²)",
        insight: "正規分布の再生性は統計学で重宝される性質"
      },
      {
        question: "1日に平均5件の事故が発生。3件以上発生する確率P(X≥3)を求めよ（e⁻⁵≈0.0067）。",
        hint: "P(X≥3) = 1 - P(X≤2)",
        solution: "【余事象を使う】\nP(X≥3) = 1 - P(X≤2)\n\n【P(X≤2)の計算】\nP(0) = e⁻⁵ = 0.0067\nP(1) = e⁻⁵×5 = 0.0335\nP(2) = e⁻⁵×25/2 = 0.0839\nP(X≤2) = 0.124\n\n【結果】\nP(X≥3) = 1 - 0.124 = 0.876",
        answer: "約0.88",
        insight: "「以上」は余事象で計算すると楽"
      },
      {
        question: "バスが平均10分間隔で来る。20分以内にバスが来る確率を求めよ。",
        hint: "指数分布の累積分布関数",
        solution: "【パラメータ】\n平均間隔10分 → λ = 1/10 = 0.1\n\n【累積分布関数】\nP(T≤20) = 1 - e^(-λt)\n= 1 - e^(-0.1×20)\n= 1 - e^(-2)\n≈ 1 - 0.135 = 0.865",
        answer: "約0.865",
        insight: "e⁻²≈0.135も覚えておくと便利"
      }
    ]
  },
  {
    id: 5,
    title: "正規分布の確率計算と近似",
    icon: "📐",
    color: "#26de81",
    theory: {
      background: "二項分布を他の分布で近似する手法は、計算の簡略化と分布間の極限関係を示す理論的な柱。近似条件を正確に覚えることが重要。",
      keyInsight: "ポアソン近似は「稀な事象の多数回試行」、正規近似は「十分大きなサンプル」に適用。条件の使い分けが鍵。",
      commonMistakes: [
        "正規近似で連続性の補正を忘れる",
        "ポアソン近似と正規近似の条件を混同",
        "標準化で分母をσ²にしてしまう",
        "P(Z≤-a)=P(Z≥a)の対称性を忘れる"
      ]
    },
    concepts: [
      "標準正規分布表はP(Z≥a)またはP(Z≤a)の値を与える",
      "正規分布の対称性: P(Z≤-a) = P(Z≥a)",
      "ポアソン近似: nが大きくpが小さいとき B(n,p)→Po(np)",
      "正規近似: np≥5かつn(1-p)≥5のとき B(n,p)→N(np, np(1-p))",
    ],
    formulas: [
      { name: "標準正規分布表", formula: "P(Z \\geq a) \\text{ を表から読む}", note: "上側確率", importance: 3 },
      { name: "対称性", formula: "P(Z \\leq -a) = P(Z \\geq a)", note: "★左右対称", importance: 3 },
      { name: "区間確率", formula: "P(a \\leq Z \\leq b) = P(Z \\geq a) - P(Z \\geq b)", note: "", importance: 2 },
      { name: "ポアソン近似条件", formula: "n \\geq 100,\\, p \\leq 0.05,\\, np \\text{ 一定}", note: "稀な事象", importance: 3 },
      { name: "ポアソン近似", formula: "B(n,p) \\to Po(\\lambda = np)", note: "", importance: 3 },
      { name: "正規近似条件", formula: "np \\geq 5 \\text{ かつ } n(1-p) \\geq 5", note: "", importance: 3 },
      { name: "正規近似", formula: "B(n,p) \\to N(np,\\, np(1-p))", note: "", importance: 3 },
    ],
    procedure: [
      "【正規分布表の使い方】",
      "Step 1: 標準化 Z=(X-μ)/σ",
      "Step 2: 表からP(Z≥z)を読む",
      "Step 3: 必要に応じて変換：",
      "  P(Z≤a) = 1 - P(Z≥a)",
      "  P(Z≤-a) = P(Z≥a)",
      "【近似の選択】",
      "npが小さい(≤10)でnが大→ポアソン",
      "np, n(1-p)両方≥5→正規"
    ],
    problems: [
      {
        question: "X ~ N(10, 9)のとき、P(X≧13)を求めよ。（P(Z≥1)=0.1587）",
        hint: "まずXを標準化してZにする",
        solution: "【パラメータ】\nμ = 10, σ² = 9 → σ = 3\n\n【標準化】\nZ = (X-10)/3\nX=13のとき Z = (13-10)/3 = 1\n\n【確率】\nP(X≧13) = P(Z≧1) = 0.1587",
        answer: "0.1587",
        insight: "平均+1σ以上の確率は約16%"
      },
      {
        question: "X ~ N(10, 9)のとき、P(7≦X≦13)を求めよ。",
        hint: "P(−1≤Z≤1) = 1 − 2×P(Z≥1)",
        solution: "【標準化】\nX=7 → Z=(7-10)/3=-1\nX=13 → Z=(13-10)/3=1\n\n【区間確率】\nP(7≦X≦13) = P(-1≦Z≦1)\n= 1 - P(Z≤-1) - P(Z≥1)\n= 1 - 2×P(Z≥1)\n= 1 - 2×0.1587 = 0.6826",
        answer: "0.6826（約68%）",
        insight: "平均±1σの範囲に約68%が含まれる"
      },
      {
        question: "P(-2≤Z≤1)を求めよ。（P(Z≥1)=0.1587, P(Z≥2)=0.0228）",
        hint: "区間を分解して計算",
        solution: "【方法】\nP(-2≤Z≤1) = P(Z≤1) - P(Z≤-2)\n\n【各確率】\nP(Z≤1) = 1 - P(Z≥1) = 1 - 0.1587 = 0.8413\nP(Z≤-2) = P(Z≥2) = 0.0228（対称性）\n\n【結果】\nP(-2≤Z≤1) = 0.8413 - 0.0228 = 0.8185",
        answer: "0.8185",
        insight: "非対称な区間は分解して計算"
      },
      {
        question: "当たり確率1/50のくじを150回引く。当たり回数Sをポアソン近似し、P(S=4)を求めよ（e⁻³=0.05）。",
        hint: "λ = np = 150×(1/50) = 3",
        solution: "【近似条件確認】\nn=150(大), p=1/50=0.02(小)\nnp=3(小さい) → ポアソン近似適切\n\n【ポアソン分布】\nS ~ Po(λ=3)\n\n【計算】\nP(S=4) = e⁻³×3⁴/4!\n= 0.05×81/24\n= 0.05×3.375 = 0.169",
        answer: "0.17",
        insight: "npが小さいのでポアソン近似が適切"
      },
      {
        question: "当たり確率1/50のくじを2500回引く。当たり回数Tを正規近似し、P(T≧43)を求めよ。",
        hint: "T ~ N(np, np(1-p)) で近似",
        solution: "【近似条件確認】\nnp = 2500×0.02 = 50 ≥ 5 ✓\nn(1-p) = 2500×0.98 = 2450 ≥ 5 ✓\n→ 正規近似適切\n\n【パラメータ】\nμ = np = 50\nσ² = np(1-p) = 50×0.98 = 49\nσ = 7\n\n【標準化と確率】\nZ = (43-50)/7 = -1\nP(T≧43) = P(Z≧-1) = P(Z≤1)\n= 1 - 0.1587 = 0.8413",
        answer: "0.8413",
        insight: "npが大きいので正規近似が適切"
      },
      {
        question: "X ~ N(100, 225)のとき、上位10%に入るには何点以上必要か？（P(Z≥1.28)≈0.10）",
        hint: "P(X≥a) = 0.10 となるaを求める",
        solution: "【逆問題】\nP(Z≥z) = 0.10 となるzを探す\n→ z = 1.28\n\n【逆標準化】\nσ = √225 = 15\na = μ + z×σ\n= 100 + 1.28×15\n= 100 + 19.2 = 119.2",
        answer: "約119点以上",
        insight: "標準化の逆変換で具体的な値を求める"
      }
    ]
  },
  {
    id: 6,
    title: "標本平均と中心極限定理",
    icon: "🎲",
    color: "#fd9644",
    theory: {
      background: "中心極限定理は統計学の最も重要な定理。「母集団の分布が何であっても、サンプルサイズが十分大きければ標本平均は正規分布に近づく」という強力な結果。",
      keyInsight: "分散がσ²/nに縮小することが推定の根拠。データを多く集めるほど標本平均は真の平均μに集中する。",
      commonMistakes: [
        "V[X̄] = σ²/n で、分母はnであって√nではない",
        "標準誤差 σ/√n と標準偏差 σ を混同",
        "標本平均の標準化で σ で割ってしまう（正しくは σ/√n）",
        "中心極限定理は元の分布によらず成り立つことを忘れる"
      ]
    },
    concepts: [
      "標本平均X̄はサンプルの平均値で、確率変数である",
      "中心極限定理: nが大きければ、元の分布によらず標本平均は正規分布に近づく",
      "標本平均の分散は母分散をnで割った値（標準誤差²）",
      "サンプルサイズを4倍にすると標準誤差は半分になる",
    ],
    formulas: [
      { name: "標本平均の期待値", formula: "E[\\bar{X}] = \\mu", note: "★母平均と同じ", importance: 3 },
      { name: "標本平均の分散", formula: "V[\\bar{X}] = \\frac{\\sigma^2}{n}", note: "★母分散÷サンプルサイズ", importance: 3 },
      { name: "標準誤差", formula: "SE = \\frac{\\sigma}{\\sqrt{n}}", note: "標本平均の標準偏差", importance: 3 },
      { name: "中心極限定理", formula: "\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)", note: "n大のとき近似的に", importance: 3 },
      { name: "標本平均の標準化", formula: "Z = \\frac{\\bar{X}-\\mu}{\\sigma/\\sqrt{n}}", note: "★分母に注意！", importance: 3 },
    ],
    procedure: [
      "Step 1: 母集団のμ, σ²を確認",
      "Step 2: サンプルサイズnを確認",
      "Step 3: E[X̄]=μ, V[X̄]=σ²/n を計算",
      "Step 4: 標準誤差SE=σ/√nを計算",
      "Step 5: 標準化 Z=(X̄-μ)/(σ/√n)",
      "★最大の罠: σ で割らない！σ/√n で割る"
    ],
    problems: [
      {
        question: "母平均50、母分散400の母集団からn=100の標本を抽出。標本平均X̄の期待値と分散を求めよ。",
        hint: "E[X̄]=μ, V[X̄]=σ²/n",
        solution: "【期待値】\nE[X̄] = μ = 50\n\n【分散】\nV[X̄] = σ²/n = 400/100 = 4\n\n【標準誤差】\nSE = √4 = 2\n\n【比較】\n個々のデータの標準偏差: σ=20\n標本平均の標準偏差: SE=2（1/10に縮小）",
        answer: "E[X̄]=50, V[X̄]=4, SE=2",
        insight: "n=100でばらつきが1/10に縮小"
      },
      {
        question: "上記の標本平均X̄が従う分布を答えよ。",
        hint: "中心極限定理を適用",
        solution: "【中心極限定理】\nn=100は十分大きいので適用可能\n\n【標本平均の分布】\nX̄ ~ N(μ, σ²/n)\n= N(50, 4)\n\n平均50、分散4（標準偏差2）の正規分布",
        answer: "N(50, 4)",
        insight: "元の分布が何であっても正規分布に近づく"
      },
      {
        question: "上記の条件でP(X̄≧53)を求めよ。（P(Z≥1.5)=0.0668）",
        hint: "Z = (X̄-50)/2 で標準化（σ=20ではなく！）",
        solution: "【標準化】★最重要ポイント\nZ = (X̄-μ)/(σ/√n)\n= (X̄-50)/(20/10)\n= (X̄-50)/2\n\n【確率計算】\nP(X̄≧53) = P(Z≧(53-50)/2)\n= P(Z≧1.5) = 0.0668\n\n★間違い: Z=(53-50)/20=0.15（これはダメ！）",
        answer: "0.0668",
        insight: "σ/√n で割ることが最大のポイント"
      },
      {
        question: "母平均μ、母分散36の母集団からn=9の標本を抽出。標本平均の標準偏差（標準誤差）を求めよ。",
        hint: "標準誤差 = σ/√n",
        solution: "【母標準偏差】\nσ = √36 = 6\n\n【標準誤差】\nSE = σ/√n = 6/√9 = 6/3 = 2",
        answer: "2",
        insight: "n=9でσが1/3に縮小"
      },
      {
        question: "標準誤差を半分にするには、サンプルサイズを何倍にすればよいか？",
        hint: "SE = σ/√n の関係",
        solution: "【標準誤差の式】\nSE = σ/√n\n\n【SEを半分にする】\nSE/2 = σ/√n'\nσ/(2√n) = σ/√n'\n√n' = 2√n\nn' = 4n",
        answer: "4倍",
        insight: "精度を2倍にするにはサンプル4倍必要"
      },
      {
        question: "母平均100、母標準偏差20の母集団からn=64の標本を抽出。P(X̄≤97.5)を求めよ。",
        hint: "標準誤差=20/8=2.5",
        solution: "【標準誤差】\nSE = 20/√64 = 20/8 = 2.5\n\n【標準化】\nZ = (97.5-100)/2.5 = -2.5/2.5 = -1\n\n【確率】\nP(X̄≤97.5) = P(Z≤-1)\n= P(Z≥1)（対称性）\n= 0.1587",
        answer: "0.1587",
        insight: "平均-1SE以下の確率は約16%"
      }
    ]
  },
  {
    id: 7,
    title: "χ²分布・t分布・不偏推定量",
    icon: "📉",
    color: "#eb3b5a",
    theory: {
      background: "χ²分布は標準正規分布する変数の2乗和の分布。t分布は母分散未知のときに使う。推定量の良さは「不偏性」と「有効性（分散の小ささ）」で判断。",
      keyInsight: "不偏分散でn-1で割る理由は、標本平均を使うことでΣ(Xᵢ-X̄)=0という制約が生じ、自由度が1減るため。",
      commonMistakes: [
        "不偏分散はn-1で割る（nではない！）",
        "χ²分布表の読み方: χ²ₙ(α)はP(X≥a)=αとなるa",
        "不偏性と一致性は独立した概念",
        "推定量の比較は「不偏かつ分散小」で判断"
      ]
    },
    concepts: [
      "χ²分布は標準正規分布に従う変数の2乗和の分布",
      "t分布は母分散未知のときに使う分布",
      "不偏推定量は「期待値が母数と等しい」推定量",
      "有効性は「分散が小さい」こと、同じ不偏なら分散小が良い",
    ],
    formulas: [
      { name: "χ²分布の定義", formula: "Z_1^2 + Z_2^2 + \\cdots + Z_n^2 \\sim \\chi^2(n)", note: "自由度n", importance: 3 },
      { name: "χ²の期待値", formula: "E[\\chi^2(n)] = n", note: "", importance: 2 },
      { name: "χ²の分散", formula: "V[\\chi^2(n)] = 2n", note: "", importance: 2 },
      { name: "不偏推定量の条件", formula: "E[\\hat{\\theta}] = \\theta", note: "★期待値=母数", importance: 3 },
      { name: "不偏分散", formula: "s^2 = \\frac{\\sum(X_i - \\bar{X})^2}{n-1}", note: "★n-1で割る", importance: 3 },
      { name: "有効性の比較", formula: "V[\\hat{\\theta}_1] < V[\\hat{\\theta}_2] \\text{ なら } \\hat{\\theta}_1 \\text{ が優}", note: "", importance: 2 },
    ],
    procedure: [
      "【不偏性の確認】",
      "Step 1: 推定量θ̂の期待値E[θ̂]を計算",
      "Step 2: E[θ̂]=θなら不偏",
      "【推定量の比較】",
      "Step 1: 両方が不偏か確認",
      "Step 2: 分散V[θ̂]を計算",
      "Step 3: 分散が小さい方が優れている"
    ],
    problems: [
      {
        question: "χ²(4)分布で、P(X≧9.49)=0.05のとき、χ²₄(0.05)の値を答えよ。",
        hint: "χ²ₙ(α)はP(X≧a)=αとなるaの値",
        solution: "【定義】\nχ²ₙ(α)は、自由度nのχ²分布で\n上側確率がαとなる点\n\n【読み取り】\nP(X≧9.49) = 0.05 より\nχ²₄(0.05) = 9.49",
        answer: "9.49",
        insight: "自由度4、上側確率5%点"
      },
      {
        question: "X,Y~N(0,4)が独立のとき、X²+Y²≤18.44となる確率を求めよ。（P(χ²(2)≥4.61)=0.10）",
        hint: "(X/2)²+(Y/2)²はχ²(2)に従う",
        solution: "【標準化】\nX~N(0,4) → X/2~N(0,1)\nY~N(0,4) → Y/2~N(0,1)\n\n【χ²分布への変換】\n(X/2)² + (Y/2)² ~ χ²(2)\n= (X²+Y²)/4 ~ χ²(2)\n\n【確率計算】\nX²+Y²≤18.44 ⟺ (X²+Y²)/4≤4.61\n\nP(χ²(2)≤4.61) = 1 - P(χ²(2)≥4.61)\n= 1 - 0.10 = 0.90",
        answer: "0.90",
        insight: "2次元正規分布の距離の問題"
      },
      {
        question: "K=(X₁−X₂+X₃)/2 と L=(X₁+X₂+X₃)/3 のどちらが平均μの推定量として優れているか。",
        hint: "まず不偏性を確認、次に分散を比較",
        solution: "【不偏性の確認】\nE[K] = (μ-μ+μ)/2 = μ/2 ≠ μ\n→ Kは不偏ではない！\n\nE[L] = (μ+μ+μ)/3 = μ\n→ Lは不偏\n\n【結論】\nKは不偏ですらないので、\nLが明らかに優れている",
        answer: "L（Kは不偏ですらない）",
        insight: "係数の和が1でないと不偏にならない"
      },
      {
        question: "A=(X₁+X₂)/2 と B=(X₁+2X₂)/3 で、どちらがμの推定量として優れているか。",
        hint: "まず両方が不偏か確認、次に分散を比較",
        solution: "【不偏性】\nE[A] = (μ+μ)/2 = μ ✓\nE[B] = (μ+2μ)/3 = μ ✓\n両方不偏\n\n【分散比較】\nV[A] = (1²+1²)σ²/4 = 2σ²/4 = σ²/2\nV[B] = (1²+2²)σ²/9 = 5σ²/9\n\n【比較】\nσ²/2 = 4.5σ²/9 < 5σ²/9\nV[A] < V[B]",
        answer: "A（分散が小さい）",
        insight: "同じ不偏なら分散小が優れる"
      },
      {
        question: "なぜ不偏分散はnではなくn-1で割るのか説明せよ。",
        hint: "自由度の減少",
        solution: "【理由】\n1. 標本平均X̄を計算に使うと\n   Σ(Xᵢ-X̄) = 0 という制約が生じる\n\n2. n個の偏差のうち自由に動けるのは\n   n-1個（最後の1個は決まる）\n\n3. nで割ると分散を過小評価する\n\n4. n-1で割ることでE[s²]=σ²となり\n   不偏推定量になる",
        answer: "自由度がn-1になるため",
        insight: "自由度の概念が重要"
      },
      {
        question: "χ²(10)分布の期待値と分散を求めよ。",
        hint: "E[χ²(n)]=n, V[χ²(n)]=2n",
        solution: "【公式適用】\nχ²(n)の期待値 = n\nχ²(n)の分散 = 2n\n\n【n=10の場合】\nE[χ²(10)] = 10\nV[χ²(10)] = 2×10 = 20",
        answer: "E=10, V=20",
        insight: "分散は期待値の2倍"
      }
    ]
  },
  {
    id: 8,
    title: "最尤推定と信頼区間",
    icon: "🎯",
    color: "#45aaf2",
    theory: {
      background: "最尤推定は「観測データが最も起こりやすいパラメータを探す」手法。信頼区間は「この方法で区間を作ると、一定確率で母数を含む」という意味。",
      keyInsight: "最尤推定値は「確率最大」ではなく「尤度最大」のパラメータ。信頼区間の解釈は「母数がこの区間にある確率95%」ではない。",
      commonMistakes: [
        "信頼区間の誤った解釈（母数が区間内にある確率ではない）",
        "最尤推定で対数を取る理由（積→和で計算が楽）",
        "z(0.05)=1.96, z(0.01)=2.58 を混同",
        "信頼区間の公式でσ/√nを忘れる"
      ]
    },
    concepts: [
      "最尤推定は「観測データが得られる確率を最大化する」パラメータ推定法",
      "尤度関数L(θ)は「パラメータθのもとでデータが得られる確率」",
      "対数尤度を使うと計算が楽になる（積が和になる）",
      "信頼区間は「母数が含まれると考えられる範囲」",
    ],
    formulas: [
      { name: "尤度関数", formula: "L(\\theta) = \\prod_i P(X_i|\\theta)", note: "同時確率", importance: 2 },
      { name: "対数尤度", formula: "l(\\theta) = \\log L(\\theta) = \\sum_i \\log P(X_i|\\theta)", note: "積→和", importance: 2 },
      { name: "最尤推定", formula: "\\frac{dl}{d\\theta} = 0 \\text{ を解く}", note: "微分して0", importance: 3 },
      { name: "信頼区間", formula: "\\bar{x} \\pm z(\\alpha) \\cdot \\frac{\\sigma}{\\sqrt{n}}", note: "★母分散既知", importance: 3 },
      { name: "95%信頼区間", formula: "z(0.05) = 1.96", note: "★暗記", importance: 3 },
      { name: "99%信頼区間", formula: "z(0.01) = 2.58", note: "★暗記", importance: 3 },
    ],
    procedure: [
      "【最尤推定】",
      "Step 1: 尤度関数L(θ)を立てる",
      "Step 2: 対数尤度l(θ)=logL(θ)を計算",
      "Step 3: dl/dθ=0を解いてθ̂を求める",
      "【信頼区間】",
      "Step 1: 標準誤差SE=σ/√nを計算",
      "Step 2: z(α)を決定（95%なら1.96）",
      "Step 3: x̄±z(α)×SEで区間を構成"
    ],
    problems: [
      {
        question: "7問中4問正解したとき、正解率θの最尤推定値を求めよ。",
        hint: "尤度関数を微分して0とおく",
        solution: "【尤度関数】\nL(θ) = C(7,4)θ⁴(1-θ)³\n\n【対数尤度】\nl(θ) = log(C) + 4logθ + 3log(1-θ)\n\n【微分】\ndl/dθ = 4/θ - 3/(1-θ) = 0\n\n【解く】\n4(1-θ) = 3θ\n4 - 4θ = 3θ\n4 = 7θ\nθ = 4/7",
        answer: "4/7 ≈ 0.571",
        insight: "最尤推定値=成功数/試行数（直感と一致）"
      },
      {
        question: "コインを10回投げて6回表が出た。表の確率pの最尤推定値は？",
        hint: "二項分布の最尤推定",
        solution: "【一般論】\n二項分布の最尤推定値は\nθ̂ = 成功数/試行数\n\n【本問】\np̂ = 6/10 = 0.6",
        answer: "0.6",
        insight: "標本比率がそのまま最尤推定値"
      },
      {
        question: "n=100, x̄=60, σ²=36のとき、母平均の99%信頼区間を求めよ（z(0.01)=2.58）。",
        hint: "x̄ ± z(α)·σ/√n",
        solution: "【標準誤差】\nσ = 6\nSE = σ/√n = 6/√100 = 6/10 = 0.6\n\n【信頼区間】\n60 ± 2.58×0.6\n= 60 ± 1.548\n= [58.452, 61.548]",
        answer: "[58.452, 61.548]",
        insight: "99%信頼区間は95%より広い"
      },
      {
        question: "n=64, x̄=75, σ=16のとき、母平均の95%信頼区間を求めよ。",
        hint: "z(0.05)=1.96",
        solution: "【標準誤差】\nSE = σ/√n = 16/√64 = 16/8 = 2\n\n【信頼区間】\n75 ± 1.96×2\n= 75 ± 3.92\n= [71.08, 78.92]",
        answer: "[71.08, 78.92]",
        insight: "z(0.05)=1.96は必ず暗記"
      },
      {
        question: "信頼区間の幅を半分にするには、サンプルサイズを何倍にする必要があるか？",
        hint: "幅 ∝ 1/√n",
        solution: "【信頼区間の幅】\n幅 = 2×z(α)×σ/√n\n\n【幅を半分にする】\nσ/√nを半分にするには\n√nを2倍にする\nつまりnを4倍にする",
        answer: "4倍",
        insight: "精度2倍にはサンプル4倍必要"
      },
      {
        question: "「95%信頼区間[10, 20]」の正しい解釈を述べよ。",
        hint: "「95%の確率で母数が含まれる」ではない",
        solution: "【正しい解釈】\n「このような方法で信頼区間を\n構成すると、100回中約95回は\n真の母数を含む区間が得られる」\n\n【誤った解釈】\n「母数が[10,20]にある確率が95%」\n（母数は定数であり確率変数ではない）",
        answer: "この方法で区間を作ると95%の確率で母数を含む",
        insight: "母数は確率変数ではない点が重要"
      }
    ]
  },
  {
    id: 9,
    title: "仮説検定",
    icon: "⚖️",
    color: "#8854d0",
    theory: {
      background: "仮説検定は「背理法」的な論法。帰無仮説H₀のもとで観測データが稀すぎる場合、H₀を棄却して対立仮説H₁を採択する。",
      keyInsight: "「棄却できない」≠「H₀が正しい」。これは「H₀を棄却する十分な証拠がない」というだけで、H₀の正しさを証明するものではない。",
      commonMistakes: [
        "片側検定と両側検定で棄却域が違う",
        "z(0.05)=1.645（片側5%）とz(0.025)=1.96（両側5%）の混同",
        "「棄却できない」を「H₀が正しい」と誤解",
        "有意水準は検定前に決める"
      ]
    },
    concepts: [
      "帰無仮説H₀は「差がない」「効果がない」という仮説",
      "対立仮説H₁は「証明したい」仮説",
      "有意水準αは「H₀が正しいのに棄却する確率」の上限",
      "p値は「H₀が正しいとき、観測値以上に極端な値が得られる確率」",
    ],
    formulas: [
      { name: "検定統計量", formula: "Z = \\frac{\\bar{X}-\\mu_0}{\\sigma/\\sqrt{n}}", note: "★母分散既知", importance: 3 },
      { name: "片側検定（右）", formula: "\\text{棄却域: } Z \\geq z(\\alpha)", note: "H₁: μ>μ₀", importance: 3 },
      { name: "片側検定（左）", formula: "\\text{棄却域: } Z \\leq -z(\\alpha)", note: "H₁: μ<μ₀", importance: 3 },
      { name: "両側検定", formula: "\\text{棄却域: } |Z| \\geq z(\\alpha/2)", note: "H₁: μ≠μ₀", importance: 3 },
      { name: "第1種の過誤", formula: "H_0 \\text{ が正しいのに棄却 (確率} \\leq \\alpha)", note: "", importance: 3 },
      { name: "第2種の過誤", formula: "H_0 \\text{ が誤りなのに採択 (確率} = \\beta)", note: "", importance: 3 },
    ],
    procedure: [
      "Step 1: 帰無仮説H₀と対立仮説H₁を設定",
      "Step 2: 有意水準αを決定（通常5%か1%）",
      "Step 3: 検定統計量Zを計算",
      "Step 4: 棄却域を決定",
      "  片側(右): Z≥z(α)",
      "  片側(左): Z≤-z(α)",
      "  両側: |Z|≥z(α/2)",
      "Step 5: 統計量が棄却域に入るか判定",
      "Step 6: 結論を述べる"
    ],
    problems: [
      {
        question: "全国平均48点(σ=30)、ある県の225人の平均が44.6点。この県の学力は全国より低いか（有意水準5%）。",
        hint: "H₀:μ=48, H₁:μ<48（片側検定）",
        solution: "【仮説設定】\nH₀: μ = 48（全国平均と同じ）\nH₁: μ < 48（全国より低い）\n\n【検定統計量】\nZ = (44.6-48)/(30/√225)\n= -3.4/(30/15)\n= -3.4/2 = -1.7\n\n【棄却域】\n片側5%: Z ≤ -1.645\n\n【判定】\n-1.7 < -1.645 → 棄却域に入る\n→ H₀を棄却",
        answer: "全国平均より低いと判断（有意）",
        insight: "片側検定の棄却点は-1.645"
      },
      {
        question: "上記の結論が間違っている場合、何の過誤か。",
        hint: "H₀を棄却した結果が間違いの場合",
        solution: "【状況】\nH₀を棄却して「低い」と判断した\n\n【もし間違いなら】\n実際はH₀が正しい（全国平均と同じ）\nのに、棄却してしまった\n\n→ 第1種の過誤（α過誤）",
        answer: "第1種の過誤",
        insight: "「無実の人を有罪にする」タイプの誤り"
      },
      {
        question: "有意水準5%の両側検定で、棄却域を答えよ（z(0.025)=1.96）。",
        hint: "両側検定では両端に2.5%ずつ",
        solution: "【両側検定】\n5%を両端に2.5%ずつ配分\n\n【棄却点】\nα/2 = 0.025\nz(0.025) = 1.96\n\n【棄却域】\n|Z| ≥ 1.96\nつまり Z ≤ -1.96 または Z ≥ 1.96",
        answer: "|Z| ≥ 1.96",
        insight: "両側5%と片側5%で棄却点が違う"
      },
      {
        question: "H₀を棄却できなかった場合、H₀は正しいと言えるか。",
        hint: "「棄却できない」と「正しい」は違う",
        solution: "【答え】\n言えない\n\n【理由】\n棄却できないことは\n「H₀を棄却する十分な証拠がない」\nというだけ。\n\nH₀が正しいことを証明する\nものではない。",
        answer: "言えない（証拠不十分なだけ）",
        insight: "帰無仮説を「採択」とは言わない"
      },
      {
        question: "ある薬の効果を検証。H₀:効果なし、H₁:効果ありで検定。第2種の過誤とは？",
        hint: "H₁が正しいのに見逃す",
        solution: "【第2種の過誤】\n実際には薬に効果がある（H₁が正しい）\nのに、H₀を棄却できず\n「効果なし」と判断すること\n\n→ 本当は効く薬を「効かない」と誤判断",
        answer: "効果があるのに「ない」と判断",
        insight: "「真犯人を逃がす」タイプの誤り"
      },
      {
        question: "検定統計量Z=2.5が得られた。両側検定で有意水準5%のとき、結論は？",
        hint: "z(0.025)=1.96と比較",
        solution: "【棄却域】\n両側5%: |Z| ≥ 1.96\n\n【判定】\n|Z| = |2.5| = 2.5 > 1.96\n→ 棄却域に入る\n\n【結論】\nH₀を棄却（有意差あり）",
        answer: "H₀を棄却（有意差あり）",
        insight: "Z=2.5は1.96より大きいので有意"
      },
      {
        question: "p値が0.03のとき、有意水準5%と1%でそれぞれどう判断するか？",
        hint: "p値<αなら棄却",
        solution: "【有意水準5%】\np=0.03 < 0.05 → H₀棄却\n\n【有意水準1%】\np=0.03 > 0.01 → H₀棄却せず\n\n【解釈】\np値が小さいほど\n「H₀と矛盾する証拠が強い」",
        answer: "5%で棄却、1%で棄却せず",
        insight: "有意水準が厳しいほど棄却されにくい"
      }
    ]
  }
];

// 分布間の関係データ
const distributionRelations = {
  title: "確率分布間の関係と近似条件",
  relations: [
    {
      from: "二項分布 B(n,p)",
      to: "ポアソン分布 Po(λ)",
      condition: "n≥100, p≤0.05, λ=np一定",
      description: "稀な事象の多数回試行",
      example: "不良品率0.5%の製品を200個検査"
    },
    {
      from: "二項分布 B(n,p)",
      to: "正規分布 N(np, np(1-p))",
      condition: "np≥5 かつ n(1-p)≥5",
      description: "十分大きなサンプル",
      example: "コインを100回投げたときの表の回数"
    },
    {
      from: "ポアソン分布 Po(λ)",
      to: "指数分布 Exp(λ)",
      condition: "同じポアソン過程",
      description: "件数→間隔への変換",
      example: "1時間に平均3件→間隔の平均1/3時間"
    },
    {
      from: "任意の分布",
      to: "正規分布（標本平均）",
      condition: "n≥30（中心極限定理）",
      description: "標本平均の分布",
      example: "どんな母集団でもX̄は正規分布に近づく"
    }
  ]
};

// 最重要公式リスト（表形式）
const essentialFormulas = [
  { category: "確率", name: "条件付き確率", formula: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}", importance: "★★★", note: "分母を取り違えないこと" },
  { category: "確率", name: "ベイズの定理", formula: "P(A|B) = \\frac{P(B|A)P(A)}{P(B)}", importance: "★★★", note: "尤度×事前確率÷正規化定数" },
  { category: "確率変数", name: "期待値の線形性", formula: "E[aX+b] = aE[X]+b", importance: "★★★", note: "そのまま係数が出る" },
  { category: "確率変数", name: "分散の線形性", formula: "V[aX+b] = a^2 V[X]", importance: "★★★", note: "係数は2乗、定数は消える" },
  { category: "確率変数", name: "分散の計算式", formula: "V[X] = E[X^2] - (E[X])^2", importance: "★★★", note: "計算効率化の鍵" },
  { category: "分布", name: "二項分布", formula: "E=np,\\quad V=np(1-p)", importance: "★★★", note: "最頻出" },
  { category: "分布", name: "ポアソン分布", formula: "P(X=k)=\\frac{e^{-\\lambda}\\lambda^k}{k!}", importance: "★★", note: "E=V=λ" },
  { category: "分布", name: "幾何分布", formula: "E=\\frac{1}{p},\\quad V=\\frac{1-p}{p^2}", importance: "★★", note: "分散の式を忘れがち" },
  { category: "標本・推定", name: "標準化", formula: "Z = \\frac{X - \\mu}{\\sigma}", importance: "★★★", note: "全ての基本" },
  { category: "標本・推定", name: "標本平均の標準化", formula: "Z = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}", importance: "★★★", note: "分母はσ/√n" },
  { category: "標本・推定", name: "信頼区間", formula: "\\bar{X} \\pm Z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}}", importance: "★★", note: "Z₀.₀₂₅=1.96は常識" },
];

// 用語定義
const glossary = [
  { term: "排反（Mutually Exclusive）", definition: "2つの事象が同時に起こらない。P(A∩B)=0", example: "サイコロで「1」と「2」が同時に出ることはない" },
  { term: "独立（Independent）", definition: "一方の事象が他方に影響しない。P(A∩B)=P(A)P(B)", example: "コイン投げの1回目と2回目の結果" },
  { term: "条件付き確率", definition: "ある事象が起きた条件下での別の事象の確率", example: "雨が降っている条件下で傘を持っている確率" },
  { term: "事前確率（Prior）", definition: "観測前のパラメータの確率分布", example: "検査前の病気である確率" },
  { term: "尤度（Likelihood）", definition: "パラメータが与えられた下でデータが観測される確率", example: "病気の人が陽性になる確率" },
  { term: "事後確率（Posterior）", definition: "観測後に更新されたパラメータの確率", example: "陽性だった人が実際に病気である確率" },
  { term: "不偏推定量", definition: "期待値が真の値と一致する推定量。E[θ̂]=θ", example: "標本平均は母平均の不偏推定量" },
  { term: "標準誤差（SE）", definition: "標本統計量の標準偏差。SE=σ/√n", example: "標本平均のばらつきの指標" },
];

// 分布近似の条件表
const approximationTable = [
  { type: "ポアソン近似", from: "B(n,p)", to: "Po(np)", condition: "n≥100, p≤0.05, np一定", use: "稀な事象の多数回試行", formula: "\\lambda = np" },
  { type: "正規近似", from: "B(n,p)", to: "N(np, np(1-p))", condition: "np≥5 かつ n(1-p)≥5", use: "大標本の二項分布", formula: "\\mu=np,\\, \\sigma^2=np(1-p)" },
  { type: "中心極限定理", from: "任意の分布", to: "N(μ, σ²/n)", condition: "n≥30", use: "標本平均の分布", formula: "\\bar{X} \\sim N(\\mu, \\frac{\\sigma^2}{n})" },
];

// クイックリファレンス
const quickReference = [
  {
    category: "期待値・分散の基本",
    items: [
      { formula: "E[aX+b] = aE[X]+b", note: "期待値の線形性" },
      { formula: "V[aX+b] = a^2 V[X]", note: "★bは消える！" },
      { formula: "V[X] = E[X^2]-(E[X])^2", note: "計算公式" },
      { formula: "V[X+Y] = V[X]+V[Y]", note: "独立時のみ" },
    ]
  },
  {
    category: "主要な離散分布",
    items: [
      { formula: "B(n,p): E=np,\\, V=np(1-p)", note: "★二項分布" },
      { formula: "Po(\\lambda): E=V=\\lambda", note: "★ポアソン" },
      { formula: "Ge(p): E=\\frac{1}{p},\\, V=\\frac{1-p}{p^2}", note: "幾何分布" },
    ]
  },
  {
    category: "正規分布と標準化",
    items: [
      { formula: "Z = \\frac{X-\\mu}{\\sigma}", note: "★標準化" },
      { formula: "\\text{偏差値} = 10Z + 50", note: "" },
      { formula: "P(|Z| \\leq 1) \\approx 0.68", note: "1σ区間" },
      { formula: "P(|Z| \\leq 2) \\approx 0.95", note: "2σ区間" },
    ]
  },
  {
    category: "標本と推定",
    items: [
      { formula: "E[\\bar{X}]=\\mu,\\, V[\\bar{X}]=\\frac{\\sigma^2}{n}", note: "★標本平均" },
      { formula: "SE = \\frac{\\sigma}{\\sqrt{n}}", note: "標準誤差" },
      { formula: "\\text{信頼区間: } \\bar{x} \\pm z(\\alpha) \\cdot \\frac{\\sigma}{\\sqrt{n}}", note: "" },
      { formula: "\\text{不偏分散: } \\frac{\\sum(X_i-\\bar{X})^2}{n-1}", note: "★n-1で割る" },
    ]
  },
  {
    category: "検定の棄却点",
    items: [
      { formula: "z(0.05)_{\\text{片側}} = 1.645", note: "" },
      { formula: "z(0.05)_{\\text{両側}} = 1.96", note: "★暗記" },
      { formula: "z(0.01)_{\\text{両側}} = 2.58", note: "★暗記" },
    ]
  },
  {
    category: "暗記すべき数値",
    items: [
      { formula: "e^{-1} \\approx 0.368", note: "" },
      { formula: "e^{-2} \\approx 0.135", note: "" },
      { formula: "e^{-3} \\approx 0.050", note: "★よく使う" },
      { formula: "\\sqrt{2} \\approx 1.41,\\, \\sqrt{3} \\approx 1.73", note: "" },
    ]
  }
];

// ===== コンポーネント定義 =====

function TabNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'learn', label: '📚 学習', icon: '📚' },
    { id: 'visual', label: '📊 視覚学習', icon: '📊' },
    { id: 'formulas', label: '📝 公式集', icon: '📝' },
    { id: 'essential', label: '⭐ 最重要公式', icon: '⭐' },
    { id: 'glossary', label: '📖 用語集', icon: '📖' },
    { id: 'relations', label: '🔗 分布関係', icon: '🔗' },
    { id: 'quiz', label: '🎯 クイズ', icon: '🎯' },
    { id: 'exam', label: '📝 過去問対策', icon: '📝' },
    { id: 'cheatsheet', label: '📋 カンペ', icon: '📋' },
    { id: 'checklist', label: '✅ チェックリスト', icon: '✅' },
  ];

  return (
    <nav className="tab-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

function FormulaCard({ formula }) {
  const importanceStars = '★'.repeat(formula.importance || 2);
  return (
    <div className={`formula-card importance-${formula.importance || 2}`}>
      <div className="formula-header">
        <span className="formula-name">{formula.name}</span>
        <span className="importance">{importanceStars}</span>
      </div>
      <div className="formula-eq">
        <MathFormula display>{formula.formula}</MathFormula>
      </div>
      {formula.note && <span className="formula-note">{formula.note}</span>}
    </div>
  );
}

function Problem({ problem, index, color }) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="problem-card" style={{'--card-color': color}}>
      <div className="problem-header">
        <span className="problem-number">例題 {index + 1}</span>
      </div>
      <p className="problem-question">{problem.question}</p>
      
      <div className="problem-buttons">
        <button 
          className={`hint-btn ${showHint ? 'active' : ''}`}
          onClick={() => setShowHint(!showHint)}
        >
          💡 ヒント
        </button>
        <button 
          className={`solution-btn ${showSolution ? 'active' : ''}`}
          onClick={() => setShowSolution(!showSolution)}
        >
          ✨ 解答
        </button>
      </div>

      {showHint && (
        <div className="hint-box">
          <strong>ヒント:</strong> {problem.hint}
        </div>
      )}

      {showSolution && (
        <div className="solution-box">
          <div className="solution-content">
            <strong>解法:</strong>
            <pre>{problem.solution}</pre>
          </div>
          <div className="answer-box">
            <strong>答え:</strong> {problem.answer}
          </div>
          {problem.insight && (
            <div className="insight-box">
              <strong>💡 ポイント:</strong> {problem.insight}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ section, isOpen, onToggle }) {
  const [activeSubTab, setActiveSubTab] = useState('theory');

  return (
    <div className="section" style={{'--section-color': section.color}}>
      <div className="section-header" onClick={onToggle}>
        <div className="section-title">
          <span className="section-icon">{section.icon}</span>
          <h2>{section.id}. {section.title}</h2>
        </div>
        <div className="section-meta">
          <span className="problem-count">{section.problems.length}問</span>
          <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
        </div>
      </div>
      
      {isOpen && (
        <div className="section-content">
          <div className="sub-tabs">
            <button className={activeSubTab === 'theory' ? 'active' : ''} onClick={() => setActiveSubTab('theory')}>理論</button>
            <button className={activeSubTab === 'formulas' ? 'active' : ''} onClick={() => setActiveSubTab('formulas')}>公式</button>
            <button className={activeSubTab === 'procedure' ? 'active' : ''} onClick={() => setActiveSubTab('procedure')}>解法手順</button>
            <button className={activeSubTab === 'problems' ? 'active' : ''} onClick={() => setActiveSubTab('problems')}>例題</button>
          </div>

          {activeSubTab === 'theory' && (
            <div className="theory-section">
              {section.theory && (
                <>
                  <div className="theory-background">
                    <h4>📖 理論的背景</h4>
                    <p>{section.theory.background}</p>
                  </div>
                  <div className="theory-insight">
                    <h4>💡 重要な洞察</h4>
                    <p>{section.theory.keyInsight}</p>
                  </div>
                  <div className="theory-mistakes">
                    <h4>⚠️ よくある間違い</h4>
                    <ul>
                      {section.theory.commonMistakes.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              {section.concepts && (
                <div className="concepts-section">
                  <h4>📌 重要な概念</h4>
                  <ul className="concepts-list">
                    {section.concepts.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'formulas' && (
            <div className="formulas-section">
              <div className="formulas-grid">
                {section.formulas.map((f, i) => (
                  <FormulaCard key={i} formula={f} />
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'procedure' && section.procedure && (
            <div className="procedure-section">
              <h4>📋 計算手順の標準化</h4>
              <ol className="procedure-list">
                {section.procedure.map((step, i) => (
                  <li key={i} className={step.startsWith('Step') ? 'step' : step.startsWith('Check') ? 'check' : step.startsWith('★') ? 'warning' : 'sub'}>{step}</li>
                ))}
              </ol>
            </div>
          )}
          
          {activeSubTab === 'problems' && (
            <div className="problems-section">
              <div className="problems-grid">
                {section.problems.map((p, i) => (
                  <Problem key={i} problem={p} index={i} color={section.color} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FormulasTab() {
  return (
    <div className="formulas-tab">
      <h2>📝 公式クイックリファレンス</h2>
      <p className="tab-description">試験直前に確認すべき重要公式を厳選</p>

      <div className="quick-ref-grid">
        {quickReference.map((cat, i) => (
          <div key={i} className="ref-category">
            <h4>{cat.category}</h4>
            <div className="ref-items">
              {cat.items.map((item, j) => (
                <div key={j} className="ref-item">
                  <MathFormula>{item.formula}</MathFormula>
                  {item.note && <span>{item.note}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EssentialFormulasTab() {
  const categories = [...new Set(essentialFormulas.map(f => f.category))];

  return (
    <div className="essential-tab">
      <h2>⭐ 絶対に覚えるべき最重要公式</h2>
      <p className="tab-description">試験で必ず使う公式を厳選。重要度★★★は必須暗記！</p>

      <div className="essential-table-container">
        <table className="essential-table">
          <thead>
            <tr>
              <th>カテゴリ</th>
              <th>項目</th>
              <th>公式</th>
              <th>重要度</th>
              <th>注意点</th>
            </tr>
          </thead>
          <tbody>
            {essentialFormulas.map((f, i) => (
              <tr key={i}>
                <td className="category-cell">{f.category}</td>
                <td className="name-cell">{f.name}</td>
                <td className="formula-cell"><MathFormula>{f.formula}</MathFormula></td>
                <td className="importance-cell">{f.importance}</td>
                <td className="note-cell">{f.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GlossaryTab() {
  return (
    <div className="glossary-tab">
      <h2>📖 重要用語集</h2>
      <p className="tab-description">混同しやすい用語の定義を明確にしよう</p>

      <div className="glossary-grid">
        {glossary.map((item, i) => (
          <div key={i} className="glossary-card">
            <h4 className="glossary-term">{item.term}</h4>
            <p className="glossary-definition">{item.definition}</p>
            <div className="glossary-example">
              <strong>例:</strong> {item.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RelationsTab() {
  return (
    <div className="relations-tab">
      <h2>🔗 {distributionRelations.title}</h2>
      <p className="tab-description">分布間の近似条件と使い分けを理解しよう</p>

      {/* 近似条件表 */}
      <h3 className="section-subtitle">📊 近似条件一覧表</h3>
      <div className="approx-table-container">
        <table className="approx-table">
          <thead>
            <tr>
              <th>近似の種類</th>
              <th>元の分布</th>
              <th>近似先</th>
              <th>条件</th>
              <th>使用場面</th>
            </tr>
          </thead>
          <tbody>
            {approximationTable.map((row, i) => (
              <tr key={i}>
                <td>{row.type}</td>
                <td>{row.from}</td>
                <td>{row.to}</td>
                <td>{row.condition}</td>
                <td>{row.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="section-subtitle">🔄 分布間の関係</h3>
      <div className="relations-grid">
        {distributionRelations.relations.map((rel, i) => (
          <div key={i} className="relation-card">
            <div className="relation-flow">
              <span className="dist-from">{rel.from}</span>
              <span className="arrow-right">→</span>
              <span className="dist-to">{rel.to}</span>
            </div>
            <div className="relation-condition">
              <strong>条件:</strong> {rel.condition}
            </div>
            <div className="relation-desc">
              <strong>用途:</strong> {rel.description}
            </div>
            <div className="relation-example">
              <strong>例:</strong> {rel.example}
            </div>
          </div>
        ))}
      </div>

      <div className="approximation-summary">
        <h3>📊 近似の選択フローチャート</h3>
        <div className="flow-chart">
          <div className="flow-box">二項分布 B(n,p)</div>
          <div className="flow-branch">
            <div className="flow-path">
              <span className="flow-condition">npが小さい(≤10)<br/>かつnが大きい</span>
              <div className="flow-arrow">↓</div>
              <div className="flow-result">Po(np)で近似</div>
            </div>
            <div className="flow-path">
              <span className="flow-condition">np≥5 かつ<br/>n(1-p)≥5</span>
              <div className="flow-arrow">↓</div>
              <div className="flow-result">N(np, np(1-p))で近似</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistTab() {
  const checklist = [
    { category: "標準化", items: [
      { text: "Z=(X-μ)/σ で σ² ではなく σ で割る", critical: true },
      { text: "標本平均の標準化は Z=(X̄-μ)/(σ/√n)", critical: true },
      { text: "偏差値の公式でσは標準偏差（分散ではない）", critical: false },
    ]},
    { category: "分散の計算", items: [
      { text: "V[aX+b]=a²V[X] で定数bは消える", critical: true },
      { text: "V[X+Y]=V[X]+V[Y] は独立のときのみ", critical: true },
      { text: "不偏分散はn-1で割る", critical: true },
    ]},
    { category: "分布の公式", items: [
      { text: "二項分布: E=np, V=np(1-p)", critical: true },
      { text: "ポアソン分布: E=V=λ", critical: true },
      { text: "幾何分布: E=1/p", critical: false },
      { text: "指数分布: E=1/λ", critical: false },
    ]},
    { category: "近似条件", items: [
      { text: "ポアソン近似: n大、p小、np一定", critical: false },
      { text: "正規近似: np≥5 かつ n(1-p)≥5", critical: true },
    ]},
    { category: "検定", items: [
      { text: "片側5%棄却点: z=1.645", critical: true },
      { text: "両側5%棄却点: z=1.96", critical: true },
      { text: "99%信頼区間: z=2.58", critical: true },
      { text: "「棄却できない」≠「H₀が正しい」", critical: false },
    ]},
    { category: "暗記数値", items: [
      { text: "e⁻³ ≈ 0.05", critical: true },
      { text: "P(|Z|≤1) ≈ 0.68", critical: false },
      { text: "P(|Z|≤2) ≈ 0.95", critical: false },
    ]},
  ];

  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem('stats-checklist');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    try {
      localStorage.setItem('stats-checklist', JSON.stringify(checked));
    } catch {}
  }, [checked]);

  const toggleCheck = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const resetChecklist = () => {
    if (confirm('チェックリストをリセットしますか？')) {
      setChecked({});
    }
  };

  const totalItems = checklist.reduce((sum, cat) => sum + cat.items.length, 0);
  const checkedCount = Object.values(checked).filter(v => v).length;

  return (
    <div className="checklist-tab">
      <h2>✅ 試験直前チェックリスト</h2>
      <p className="tab-description">進捗は自動保存されます</p>
      <div className="checklist-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(checkedCount/totalItems)*100}%` }}></div>
          <span className="progress-text">{checkedCount}/{totalItems} 確認済み</span>
        </div>
        <button className="reset-btn" onClick={resetChecklist}>リセット</button>
      </div>

      <div className="checklist-grid">
        {checklist.map((cat, catIdx) => (
          <div key={catIdx} className="checklist-category">
            <h4>{cat.category}</h4>
            {cat.items.map((item, itemIdx) => {
              const key = `${catIdx}-${itemIdx}`;
              return (
                <label key={itemIdx} className={`checklist-item ${item.critical ? 'critical' : ''} ${checked[key] ? 'checked' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={checked[key] || false}
                    onChange={() => toggleCheck(catIdx, itemIdx)}
                  />
                  <span>{item.text}</span>
                  {item.critical && <span className="critical-badge">重要</span>}
                </label>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// クイズモードコンポーネント
function QuizTab() {
  // クイズカテゴリ定義
  const quizCategories = {
    all: { name: "🎲 全問ランダム", icon: "🎲" },
    formula: { name: "📝 公式マスター", icon: "📝" },
    calc: { name: "🧮 計算ドリル", icon: "🧮" },
    theory: { name: "💡 理論チェック", icon: "💡" },
    dist: { name: "📊 分布の特徴", icon: "📊" },
    test: { name: "🔬 仮説検定", icon: "🔬" },
    random10: { name: "⚡ ランダム10問", icon: "⚡" },
  };

  const quizData = [
    // ===== 公式暗記系 =====
    { category: "formula", question: "二項分布 B(n,p) の期待値は？", correct: "np", wrong: ["n/p", "np(1-p)", "n(1-p)"] },
    { category: "formula", question: "二項分布 B(n,p) の分散は？", correct: "np(1-p)", wrong: ["np", "np²", "(1-p)/n"] },
    { category: "formula", question: "ポアソン分布 Po(λ) の期待値と分散は？", correct: "E[X] = V[X] = λ", wrong: ["E[X] = λ, V[X] = λ²", "E[X] = 1/λ, V[X] = λ", "E[X] = λ², V[X] = λ"] },
    { category: "formula", question: "標準化の公式は？", correct: "Z = (X - μ) / σ", wrong: ["Z = (X - μ) / σ²", "Z = (X + μ) / σ", "Z = X / σ"] },
    { category: "formula", question: "標本平均の標準化は？", correct: "Z = (X̄ - μ) / (σ/√n)", wrong: ["Z = (X̄ - μ) / σ", "Z = (X̄ - μ) / (σ²/n)", "Z = (X̄ + μ) / (σ/√n)"] },
    { category: "formula", question: "不偏分散の分母は？", correct: "n - 1", wrong: ["n", "n + 1", "n²"] },
    { category: "formula", question: "チェビシェフの不等式は？", correct: "P(|X-μ| ≥ kσ) ≤ 1/k²", wrong: ["P(|X-μ| ≥ kσ) ≤ 1/k", "P(|X-μ| ≤ kσ) ≥ 1/k²", "P(|X-μ| ≥ kσ) ≤ k²"] },
    { category: "formula", question: "ベイズの定理の分子は？", correct: "P(B|A) × P(A)", wrong: ["P(A|B) × P(B)", "P(A) × P(B)", "P(A∩B) / P(B)"] },
    { category: "formula", question: "加法定理 P(A∪B) は？", correct: "P(A) + P(B) - P(A∩B)", wrong: ["P(A) + P(B)", "P(A) × P(B)", "P(A) + P(B) + P(A∩B)"] },
    { category: "formula", question: "V[aX + b] は？", correct: "a²V[X]", wrong: ["aV[X] + b", "a²V[X] + b", "aV[X]"] },
    { category: "formula", question: "幾何分布 Ge(p) の期待値は？", correct: "1/p", wrong: ["p", "1-p", "p/(1-p)"] },
    { category: "formula", question: "指数分布 Ex(λ) の期待値は？", correct: "1/λ", wrong: ["λ", "λ²", "1/λ²"] },
    { category: "formula", question: "両側5%の棄却点 z は？", correct: "1.96", wrong: ["1.645", "2.58", "2.33"] },
    { category: "formula", question: "片側5%の棄却点 z は？", correct: "1.645", wrong: ["1.96", "2.58", "1.28"] },
    { category: "formula", question: "e⁻³ の近似値は？", correct: "≈ 0.05", wrong: ["≈ 0.37", "≈ 0.14", "≈ 0.01"] },
    { category: "formula", question: "E[aX + b] は？", correct: "aE[X] + b", wrong: ["aE[X]", "E[X] + b", "a²E[X] + b"] },
    { category: "formula", question: "幾何分布 Ge(p) の分散は？", correct: "(1-p)/p²", wrong: ["1/p²", "p(1-p)", "1/p"] },
    { category: "formula", question: "指数分布 Ex(λ) の分散は？", correct: "1/λ²", wrong: ["λ", "1/λ", "λ²"] },
    { category: "formula", question: "標準正規分布の期待値と分散は？", correct: "E[Z]=0, V[Z]=1", wrong: ["E[Z]=1, V[Z]=0", "E[Z]=0, V[Z]=0", "E[Z]=1, V[Z]=1"] },
    { category: "formula", question: "条件付き確率 P(A|B) の定義は？", correct: "P(A∩B) / P(B)", wrong: ["P(A∩B) / P(A)", "P(A) × P(B)", "P(A) / P(B)"] },
    { category: "formula", question: "余事象 P(Aᶜ) は？", correct: "1 - P(A)", wrong: ["P(A)", "1/P(A)", "-P(A)"] },
    { category: "formula", question: "標本平均X̄の分散は？", correct: "σ²/n", wrong: ["σ²", "σ/n", "σ²×n"] },

    // ===== 計算系（暗算で解ける） =====
    { category: "calc", question: "平均50、標準偏差10のとき、X=70のZスコアは？", correct: "2", wrong: ["0.2", "20", "-2"] },
    { category: "calc", question: "平均60、標準偏差5のとき、X=50のZスコアは？", correct: "-2", wrong: ["2", "-0.5", "0.5"] },
    { category: "calc", question: "E[X]=4 のとき、E[3X+2] は？", correct: "14", wrong: ["12", "6", "18"] },
    { category: "calc", question: "E[X]=5 のとき、E[2X-3] は？", correct: "7", wrong: ["10", "13", "4"] },
    { category: "calc", question: "V[X]=4 のとき、V[3X] は？", correct: "36", wrong: ["12", "4", "9"] },
    { category: "calc", question: "V[X]=9 のとき、V[2X+5] は？", correct: "36", wrong: ["18", "23", "41"] },
    { category: "calc", question: "サイコロを1回振ったときの期待値は？", correct: "3.5", wrong: ["3.0", "4.0", "2.5"] },
    { category: "calc", question: "コインを3回投げて表が出る回数の期待値は？", correct: "1.5", wrong: ["1", "2", "3"] },
    { category: "calc", question: "B(100, 0.3) の期待値は？", correct: "30", wrong: ["70", "21", "0.3"] },
    { category: "calc", question: "B(50, 0.4) の分散は？", correct: "12", wrong: ["20", "8", "24"] },
    { category: "calc", question: "Po(5) の分散は？", correct: "5", wrong: ["25", "√5", "1/5"] },
    { category: "calc", question: "n=100, σ=20 のとき、標準誤差 SE は？", correct: "2", wrong: ["0.2", "20", "200"] },
    { category: "calc", question: "n=25, σ=10 のとき、標準誤差 SE は？", correct: "2", wrong: ["0.4", "5", "50"] },
    { category: "calc", question: "Zスコア=2、偏差値は？", correct: "70", wrong: ["60", "52", "80"] },
    { category: "calc", question: "Zスコア=-1、偏差値は？", correct: "40", wrong: ["30", "49", "60"] },
    { category: "calc", question: "P(A) = 0.3, P(B|A) = 0.8 のとき P(A∩B) は？", correct: "0.24", wrong: ["1.1", "0.5", "0.027"] },
    { category: "calc", question: "n=100, σ=15 のとき95%信頼区間の幅は？", correct: "±2.94（約±3）", wrong: ["±1.5", "±15", "±29.4"] },

    // ===== 概念・理論系 =====
    { category: "theory", question: "帰無仮説を棄却できなかった時の正しい解釈は？", correct: "判断を保留（証拠不十分）", wrong: ["帰無仮説が正しいと証明された", "対立仮説が正しい", "実験失敗である"] },
    { category: "theory", question: "95%信頼区間の正しい解釈は？", correct: "この方法で作ると95%の確率で母数を含む", wrong: ["母数がこの区間に入る確率が95%", "標本の95%がこの区間にある", "誤差が5%以内である"] },
    { category: "theory", question: "第一種の過誤（α）とは？", correct: "正しい帰無仮説を誤って棄却", wrong: ["誤った帰無仮説を見逃す", "計算ミス", "標本選択の誤り"] },
    { category: "theory", question: "第二種の過誤（β）とは？", correct: "誤った帰無仮説を棄却しない", wrong: ["正しい帰無仮説を棄却", "有意水準の設定ミス", "サンプルサイズ不足"] },
    { category: "theory", question: "中心極限定理が適用できる条件は？", correct: "サンプルサイズnが十分大きい", wrong: ["母集団が正規分布", "σが既知", "母集団が有限"] },
    { category: "theory", question: "不偏分散でn-1で割る理由は？", correct: "期待値が母分散σ²と一致するため", wrong: ["計算を簡単にするため", "標本が小さいから", "正規分布に従うため"] },
    { category: "theory", question: "独立な事象A, Bについて P(A∩B) は？", correct: "P(A) × P(B)", wrong: ["P(A) + P(B)", "P(A|B)", "P(A) + P(B) - P(A∩B)"] },
    { category: "theory", question: "P(A|B) と P(B|A) の関係は？", correct: "一般に等しくない", wrong: ["常に等しい", "P(A|B) > P(B|A)", "P(A|B) < P(B|A)"] },
    { category: "theory", question: "全確率の法則の意味は？", correct: "排反事象で分解して確率を合算", wrong: ["すべての確率の積", "条件付き確率の和", "ベイズの定理の逆"] },
    { category: "theory", question: "ベイズの定理で「事前確率」とは？", correct: "データを見る前の確率 P(A)", wrong: ["データを見た後の確率", "条件付き確率", "尤度"] },
    { category: "theory", question: "ベイズの定理で「事後確率」とは？", correct: "データを見た後の確率 P(A|E)", wrong: ["データを見る前の確率", "P(E|A)", "P(E)"] },
    { category: "theory", question: "E[X+Y] は？（XとYは任意）", correct: "E[X] + E[Y]", wrong: ["E[X] × E[Y]", "E[XY]", "√(E[X]² + E[Y]²)"] },
    { category: "theory", question: "V[X+Y] は？（XとYが独立）", correct: "V[X] + V[Y]", wrong: ["V[X] × V[Y]", "(V[X] + V[Y])²", "√(V[X] + V[Y])"] },
    { category: "theory", question: "V[X-Y] は？（XとYが独立）", correct: "V[X] + V[Y]", wrong: ["V[X] - V[Y]", "|V[X] - V[Y]|", "V[X] × V[Y]"] },
    { category: "theory", question: "E[c] は？（cは定数）", correct: "c", wrong: ["0", "1", "c²"] },
    { category: "theory", question: "V[c] は？（cは定数）", correct: "0", wrong: ["c", "c²", "1"] },

    // ===== 分布の特徴系 =====
    { category: "dist", question: "ポアソン分布で成り立つ関係は？", correct: "期待値 = 分散", wrong: ["期待値 > 分散", "期待値 < 分散", "期待値 × 分散 = 1"] },
    { category: "dist", question: "正規分布の歪度は？", correct: "0（左右対称）", wrong: ["1", "-1", "σによる"] },
    { category: "dist", question: "正規分布で μ±σ の範囲に入る確率は約？", correct: "68%", wrong: ["50%", "95%", "99%"] },
    { category: "dist", question: "正規分布で μ±2σ の範囲に入る確率は約？", correct: "95%", wrong: ["68%", "90%", "99%"] },
    { category: "dist", question: "正規分布で μ±3σ の範囲に入る確率は約？", correct: "99.7%", wrong: ["95%", "99%", "99.9%"] },
    { category: "dist", question: "t分布の自由度が大きくなると？", correct: "標準正規分布に近づく", wrong: ["分散が大きくなる", "歪みが大きくなる", "一様分布に近づく"] },
    { category: "dist", question: "カイ二乗分布の自由度nのとき期待値は？", correct: "n", wrong: ["n-1", "n+1", "2n"] },
    { category: "dist", question: "二項分布がポアソン分布で近似できる条件は？", correct: "nが大きく、pが小さい", wrong: ["nが小さく、pが大きい", "npが小さい", "n(1-p)が小さい"] },
    { category: "dist", question: "二項分布の正規近似の条件は？", correct: "np ≥ 5 かつ n(1-p) ≥ 5", wrong: ["np ≥ 10", "n ≥ 30", "np ≥ 5 または n(1-p) ≥ 5"] },
    { category: "dist", question: "排反事象A, Bについて P(A∪B) は？", correct: "P(A) + P(B)", wrong: ["P(A) × P(B)", "P(A) + P(B) - P(A∩B)", "0"] },
    { category: "dist", question: "任意の事象Aについて P(A) の範囲は？", correct: "0 ≤ P(A) ≤ 1", wrong: ["-1 ≤ P(A) ≤ 1", "0 < P(A) < 1", "P(A) ≥ 0"] },
    { category: "dist", question: "全事象Ωについて P(Ω) は？", correct: "1", wrong: ["0", "∞", "不定"] },
    { category: "dist", question: "空事象φについて P(φ) は？", correct: "0", wrong: ["1", "不定", "∞"] },

    // ===== 仮説検定系 =====
    { category: "test", question: "P値が0.03、有意水準5%のとき？", correct: "帰無仮説を棄却", wrong: ["帰無仮説を採択", "判断できない", "有意水準を変更"] },
    { category: "test", question: "P値が0.08、有意水準5%のとき？", correct: "帰無仮説を棄却しない", wrong: ["帰無仮説を棄却", "対立仮説を採択", "追加実験が必要"] },
    { category: "test", question: "両側検定の帰無仮説は？", correct: "H₀: μ = μ₀", wrong: ["H₀: μ ≠ μ₀", "H₀: μ > μ₀", "H₀: μ < μ₀"] },
    { category: "test", question: "片側検定（右側）の対立仮説は？", correct: "H₁: μ > μ₀", wrong: ["H₁: μ < μ₀", "H₁: μ = μ₀", "H₁: μ ≠ μ₀"] },
    { category: "test", question: "有意水準αとは？", correct: "第一種の過誤を犯す確率の上限", wrong: ["第二種の過誤の確率", "検出力", "信頼度"] },
    { category: "test", question: "検出力（1-β）とは？", correct: "誤った帰無仮説を正しく棄却する確率", wrong: ["正しい帰無仮説を棄却する確率", "有意水準", "P値"] },
    { category: "test", question: "両側1%の棄却点 z は？", correct: "2.58", wrong: ["1.96", "2.33", "1.645"] },
    { category: "test", question: "片側1%の棄却点 z は？", correct: "2.33", wrong: ["2.58", "1.96", "1.645"] },
    { category: "test", question: "t検定を使うのはどんな時？", correct: "母分散σが未知の時", wrong: ["母分散σが既知の時", "サンプルが大きい時", "正規分布でない時"] },
    { category: "test", question: "母平均μの95%信頼区間の公式は？（σ既知）", correct: "X̄ ± 1.96 × σ/√n", wrong: ["X̄ ± 1.96 × σ", "X̄ ± 2.58 × σ/√n", "μ ± 1.96 × σ/√n"] },
    { category: "test", question: "信頼区間を狭くするには？", correct: "サンプルサイズnを大きくする", wrong: ["信頼度を上げる", "σを大きくする", "有意水準を小さくする"] },
    { category: "test", question: "信頼度を95%から99%に上げると区間は？", correct: "広くなる", wrong: ["狭くなる", "変わらない", "不定"] },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [shuffledQuiz, setShuffledQuiz] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // null = カテゴリ選択画面

  const startQuiz = (category) => {
    setSelectedCategory(category);

    let filtered;
    if (category === 'all') {
      filtered = [...quizData];
    } else if (category === 'random10') {
      // 全問からランダムに10問選択
      const allShuffled = [...quizData].sort(() => Math.random() - 0.5);
      filtered = allShuffled.slice(0, 10);
    } else {
      filtered = quizData.filter(q => q.category === category);
    }

    const shuffled = filtered.sort(() => Math.random() - 0.5).map(q => ({
      ...q,
      choices: [q.correct, ...q.wrong].sort(() => Math.random() - 0.5)
    }));

    setShuffledQuiz(shuffled);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const backToCategories = () => {
    setSelectedCategory(null);
    setShuffledQuiz([]);
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleSelect = (choice) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(choice);
    const isCorrect = choice === shuffledQuiz[currentIndex].correct;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < shuffledQuiz.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const current = shuffledQuiz[currentIndex];
  const isFinished = showResult;

  // 各カテゴリの問題数を計算
  const getCategoryCount = (cat) => {
    if (cat === 'all') return quizData.length;
    if (cat === 'random10') return 10;
    return quizData.filter(q => q.category === cat).length;
  };

  // カテゴリ選択画面
  if (selectedCategory === null) {
    return (
      <div className="quiz-tab">
        <h2>🎯 クイズモード選択</h2>
        <p className="tab-description">学習したい分野を選んでください</p>

        <div className="category-grid">
          {Object.entries(quizCategories).map(([key, cat]) => (
            <button
              key={key}
              className="category-btn"
              onClick={() => startQuiz(key)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name.replace(cat.icon + ' ', '')}</span>
              <span className="category-count">{getCategoryCount(key)}問</span>
            </button>
          ))}
        </div>

        <div className="category-tip">
          <p>💡 <strong>おすすめ</strong>: まずは「ランダム10問」で力試し、苦手分野を「計算ドリル」や「公式マスター」で克服しよう！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-tab">
      <h2>🎯 {quizCategories[selectedCategory]?.name || 'クイズ'}</h2>
      <p className="tab-description">4択から正しい答えを選んでください</p>

      <div className="quiz-stats">
        <span className="quiz-progress">{currentIndex + 1} / {shuffledQuiz.length}</span>
        <span className="quiz-score correct">正解 {score.correct}</span>
        <button className="shuffle-btn" onClick={backToCategories}>📂 モード選択</button>
        <button className="shuffle-btn" onClick={() => startQuiz(selectedCategory)}>🔀 最初から</button>
      </div>

      {current && !isFinished && (
        <div className="quiz-card">
          <div className="quiz-question">
            <h3>{current.question}</h3>
          </div>

          <div className="quiz-choices">
            {current.choices.map((choice, idx) => {
              let className = "quiz-choice";
              if (selectedAnswer !== null) {
                if (choice === current.correct) className += " correct";
                else if (choice === selectedAnswer) className += " wrong";
              }
              return (
                <button
                  key={idx}
                  className={className}
                  onClick={() => handleSelect(choice)}
                  disabled={selectedAnswer !== null}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <button className="next-btn" onClick={nextQuestion}>
              {currentIndex < shuffledQuiz.length - 1 ? "次の問題 →" : "結果を見る"}
            </button>
          )}
        </div>
      )}

      {isFinished && (
        <div className="quiz-result">
          <h3>🎉 終了！</h3>
          <p className="result-score">
            {Math.round((score.correct / shuffledQuiz.length) * 100)}%
          </p>
          <p>{score.correct} / {shuffledQuiz.length} 問正解</p>
          <div className="result-buttons">
            <button className="retry-btn" onClick={() => startQuiz(selectedCategory)}>🔄 同じモードで再挑戦</button>
            <button className="retry-btn secondary" onClick={backToCategories}>📂 モード選択に戻る</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== 過去問対策データ =====
// 教科書書き込み用カンペデータ（例題＋汎用テンプレート形式）
const examData = {
  spaces: [
    {
      id: 'hypothesis',
      title: '仮説検定（一番重要）',
      icon: '📊',
      location: '教科書の正規分布表（巻末など）の近くに書くと便利',
      example: {
        title: '例題：仮説検定（全国平均との比較）',
        problem: '全国の平均点が 66点、標準偏差が 36点 の試験がある。ある県の 144人 を調査したら、平均 60.6点 だった。全国と学力差はあるか？（有意水準5%）',
        solution: [
          {
            step: '1. 仮説の設定',
            content: '$H_0$: $\\mu = 66$ （全国と同じ）\n$H_1$: $\\mu \\neq 66$ （全国と異なる）'
          },
          {
            step: '2. 統計量 Z の計算',
            content: '公式: $Z = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$\n代入: $Z = \\frac{60.6 - 66}{36 / \\sqrt{144}} = \\frac{-5.4}{36/12} = \\frac{-5.4}{3} = -1.8$'
          },
          {
            step: '3. 判定（棄却域 R）',
            content: '基準: 有意水準5%なら $|Z| \\ge 1.96$ なら棄却\n結論: 今回は $|-1.8| < 1.96$ なので 棄却されない（採択）\n文言: 「よって、$H_0$が採択される。学力レベルは全国平均と異なるとは言えない。」'
          }
        ]
      },
      template: {
        title: '仮説検定のテンプレート',
        steps: [
          {
            step: '1. 仮説の設定',
            content: '$H_0$: $\\mu = [全国平均の数値]$ （差がない）\n$H_1$: $\\mu \\neq [全国平均の数値]$ （差がある）'
          },
          {
            step: '2. 統計量 Z の計算',
            content: '$Z = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}$\n・$\\bar{X}$: 今回の平均点\n・$\\mu$: 全国の平均点\n・$\\sigma$: 全国の標準偏差（分散ならルートする！）\n・$n$: 人数'
          },
          {
            step: '3. 判定（有意水準5%）',
            content: '棄却域: $|Z| \\ge 1.96$ （つまり 1.96 以上 または -1.96 以下）\n結論:\n・範囲に入った → 「棄却される（差があると言える）」\n・入らなかった → 「棄却されない（差があるとは言えない）」'
          }
        ]
      }
    },
    {
      id: 'bayes',
      title: 'ベイズの定理（A社・B社・C社）',
      icon: '🎯',
      location: '確率の計算スペースや、第1章のあたりに',
      example: {
        title: '例題：ベイズの定理（原因の確率）',
        problem: 'シェアは A社20%, B社30%, C社50%。不良品率は A:0.8%, B:0.4%, C:0.3%。\n(1) 不良品である確率は？ (2) 不良品のとき、それがA社製である確率は？',
        solution: [
          {
            step: '手順1：以下の3つを計算して並べる',
            content: '(A) = 0.2 × 0.008 = 0.0016\n(B) = 0.3 × 0.004 = 0.0012\n(C) = 0.5 × 0.003 = 0.0015'
          },
          {
            step: '手順2：問1「不良品である確率は？」',
            content: '答え = (A) + (B) + (C) = 0.0016 + 0.0012 + 0.0015 = 0.0043'
          },
          {
            step: '手順3：問2「不良品だった時、A社である確率は？」',
            content: '答え = $\\frac{(A)}{(A)+(B)+(C)} = \\frac{0.0016}{0.0043} = \\frac{16}{43}$'
          }
        ]
      },
      template: {
        title: '不良品・原因の確率（ベイズ）',
        steps: [
          {
            step: '手順1：以下の3つを計算して並べる',
            content: '(A) = (A社のシェア) × (Aの不良率)\n(B) = (B社のシェア) × (Bの不良率)\n(C) = (C社のシェア) × (Cの不良率)\n例: 0.35 × 0.008 = 0.0028'
          },
          {
            step: '手順2：問1「不良品である確率は？」',
            content: '答え = (A) + (B) + (C)'
          },
          {
            step: '手順3：問2「不良品だった時、それがX社である確率は？」',
            content: '答え = $\\frac{(X)}{(A)+(B)+(C)}$\n※分子は聞かれている会社の数値、分母は合計'
          }
        ]
      }
    },
    {
      id: 'estimator',
      title: '推定量の良し悪し（K, L, M）',
      icon: '⚖️',
      location: '「係数の2乗」を忘れないためのメモ',
      example: {
        title: '例題：良い推定量はどっち？',
        problem: '$K = \\frac{2X_1 - X_2 + X_3}{2}$ と $M = \\frac{X_1 - X_2 + 3X_3}{3}$、平均の推定量として良いのは？',
        solution: [
          {
            step: '1. 不偏性の確認 (平均 E をとる)',
            content: '$E[K] = \\frac{2E[X] - E[X] + E[X]}{2} = \\frac{2}{2}E[X] = E[X]$ (OK)\n$E[M] = \\frac{E[X] - E[X] + 3E[X]}{3} = \\frac{3}{3}E[X] = E[X]$ (OK)\n結論: 「両方とも不偏推定量である」'
          },
          {
            step: '2. 有効性の確認 (分散 V を計算)',
            content: '重要: 係数は 2乗 して出す！($V[aX] = a^2V[X]$)\n$V[K] = \\frac{2^2 + (-1)^2 + 1^2}{2^2} V[X] = \\frac{4+1+1}{4}V[X] = \\frac{6}{4}V[X]$\n$V[M] = \\frac{1^2 + (-1)^2 + 3^2}{3^2} V[X] = \\frac{1+1+9}{9}V[X] = \\frac{11}{9}V[X]$\n結論: 1.5 vs 1.22... なので小さい方が勝ち。\n「$V[M] < V[K]$ なので、Mの方が有効（最良）である」'
          }
        ]
      },
      template: {
        title: '推定量の判定（平均・分散）',
        steps: [
          {
            step: '1. 不偏性（平均が一致するか）',
            content: '係数をそのまま足して「1」になればOK。\n$E[K] = E[X]$ となるか確認。'
          },
          {
            step: '2. 有効性（分散が小さいか）',
            content: '重要公式: 係数を 2乗 して足す！\n$V[aX + bY] = a^2 V[X] + b^2 V[Y]$\n計算結果が 一番小さいもの が「最も良い（有効な）推定量」。\n例: $\\frac{1}{2}X_1 + \\frac{1}{2}X_2 \\rightarrow (\\frac{1}{4} + \\frac{1}{4})V[X] = \\frac{1}{2}V[X]$'
          }
        ]
      }
    },
    {
      id: 'distribution',
      title: '分布・公式まとめ',
      icon: '📐',
      location: '教科書の「分布」の章か、表紙裏のメインスペースに',
      example: {
        title: '例題：分布と確率計算',
        problem: '【ポアソン分布】1ヶ月(30日)に平均60件の事故。1日の件数Xは？1件も起きない確率は？\n【指数分布】事故から次の事故までの時間T（時間単位）は？\n【的当て】X, Y ~ N(0, 5)。半径√36.9の円に入る確率は？',
        solution: [
          {
            step: 'ポアソン分布の解答',
            content: '分布: 1日平均 = 60 ÷ 30 = 2件。よって $Po(2)$ に従う。\n確率: 1件も起きない確率は？\n$P(X=0) = e^{-2} \\frac{2^0}{0!} = e^{-2}$'
          },
          {
            step: '指数分布の解答',
            content: 'パラメータ: 1日(24h)で平均2件 → 平均間隔は 24 ÷ 2 = 12時間。\n重要: 指数分布のパラメータは「平均の逆数」。つまり $\\frac{1}{12}$。\n答え: 「パラメータ 1/12 の指数分布に従う」'
          },
          {
            step: '的当て（カイ二乗）の解答',
            content: '公式: $P = 1 - e^{-\\frac{\\text{半径}^2}{2\\sigma^2}}$\n計算: $1 - e^{-\\frac{36.9}{2 \\times 5}} = 1 - e^{-3.69}$\n（または表を使う場合: 自由度2のカイ二乗分布表を見る）'
          }
        ]
      },
      template: {
        title: '分布とパラメータ',
        steps: [
          {
            step: 'ポアソン分布 Po(λ)',
            content: '「平均λ回起きる」 → パラメータはλ\n確率: $P(X=k) = e^{-\\lambda} \\frac{\\lambda^k}{k!}$'
          },
          {
            step: '指数分布（待ち時間）',
            content: '「平均A時間」 → パラメータは $\\frac{1}{A}$ (逆数!!)\n※平均12ならパラメータは1/12'
          },
          {
            step: '二項分布の正規近似',
            content: 'n回投げて確率p → $N(np, np(1-p))$ で近似\n標準化: $Z = \\frac{X - np}{\\sqrt{np(1-p)}}$'
          },
          {
            step: '偏差値',
            content: '$T = \\frac{10(X - \\text{平均})}{\\text{標準偏差}} + 50$'
          },
          {
            step: 'カイ二乗分布（的当て）',
            content: '$X^2 + Y^2 \\le r^2$ の確率 → 自由度2のカイ二乗分布 $\\chi^2(2)$\n確率 $P = 1 - e^{-\\frac{r^2}{2\\sigma^2}}$ （または表から読む）'
          }
        ]
      }
    },
    {
      id: 'descriptive',
      title: '記述問題の答え（丸写し用）',
      icon: '✏️',
      location: '定義を聞かれたらこれをそのまま書く',
      example: null,
      template: {
        title: '記述問題カンペ',
        steps: [
          {
            step: 'ランダムサンプリングとは？',
            content: '「母集団を構成している各々の要素が、等確率で選ばれるように抽出手法を設計すること」'
          },
          {
            step: '最尤推定とは？',
            content: '「何らかの確率モデルを仮定した上で、実際に観測されたデータが最も起こりやすくなるように母数（パラメータ）を推定すること」'
          },
          {
            step: '偏差値の定義・基準は？',
            content: '「平均が50、分散が100（標準偏差10）になるようにデータを標準化したもの」\n式: $T = \\frac{10(X - \\text{平均})}{\\text{標準偏差}} + 50$'
          }
        ]
      }
    }
  ]
};

// 過去問対策タブ（教科書書き込み用カンペ形式）
function ExamTab() {
  const [activeSpace, setActiveSpace] = useState('hypothesis');

  // MathJaxの数式をレンダリングするコンポーネント
  const MathText = ({ text }) => {
    const lines = text.split('\n');
    return (
      <div style={{ lineHeight: '1.8' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ marginBottom: i < lines.length - 1 ? '8px' : 0 }}>
            <MathFormula>{line}</MathFormula>
          </div>
        ))}
      </div>
    );
  };

  const currentSpace = examData.spaces.find(s => s.id === activeSpace);

  return (
    <div className="exam-tab">
      <h2>📝 教科書書き込み用カンペ</h2>
      <p className="tab-description">試験中に「数字をどこに当てはめればいいか」が一目でわかる、例題＋テンプレート集</p>

      <div style={{
        background: 'var(--bg-warning)',
        padding: '15px 20px',
        borderRadius: '10px',
        marginBottom: '25px',
        borderLeft: '4px solid var(--border-warning)'
      }}>
        <p style={{ margin: 0, color: 'var(--text-warning)', fontSize: '0.95rem' }}>
          💡 教科書の表紙裏や空白ページにこのままブロックごとに書き写してください。数字が変わってもこの手順でいけます。
        </p>
      </div>

      {/* スペース選択タブ */}
      <div className="sub-tabs" style={{ justifyContent: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '8px' }}>
        {examData.spaces.map(space => (
          <button
            key={space.id}
            className={activeSpace === space.id ? 'active' : ''}
            onClick={() => setActiveSpace(space.id)}
            style={{ fontSize: '0.9rem' }}
          >
            {space.icon} {space.title.split('（')[0]}
          </button>
        ))}
      </div>

      {currentSpace && (
        <div className="space-content">
          {/* スペースヘッダー */}
          <div style={{
            background: 'var(--accent-color)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '12px 12px 0 0',
            marginBottom: 0
          }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{currentSpace.icon}</span>
              【スペース{examData.spaces.findIndex(s => s.id === activeSpace) + 1}：{currentSpace.title}】
            </h3>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
              📍 {currentSpace.location}
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            padding: '25px'
          }}>

            {/* 例題セクション */}
            {currentSpace.example && (
              <div style={{ marginBottom: '30px' }}>
                <div style={{
                  background: 'var(--bg-accent)',
                  borderRadius: '10px',
                  padding: '20px',
                  border: '2px solid var(--accent-color)'
                }}>
                  <h4 style={{
                    color: 'var(--text-accent)',
                    marginBottom: '15px',
                    fontSize: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      background: 'var(--accent-color)',
                      color: 'white',
                      padding: '3px 10px',
                      borderRadius: '5px',
                      fontSize: '0.85rem'
                    }}>例題</span>
                    {currentSpace.example.title}
                  </h4>

                  {/* 問題文 */}
                  <div style={{
                    background: 'var(--bg-card)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    borderLeft: '4px solid var(--text-secondary)'
                  }}>
                    <div style={{ fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.85rem' }}>【問題例】</div>
                    <div style={{ color: 'var(--text-primary)', lineHeight: '1.7' }}>
                      {currentSpace.example.problem.split('\n').map((line, i) => (
                        <div key={i}><MathFormula>{line}</MathFormula></div>
                      ))}
                    </div>
                  </div>

                  {/* 解答 */}
                  <div style={{ fontWeight: '600', color: 'var(--text-accent)', marginBottom: '12px', fontSize: '0.95rem' }}>【解答記述テンプレート】</div>
                  {currentSpace.example.solution.map((sol, i) => (
                    <div key={i} style={{
                      background: 'var(--bg-card)',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      borderLeft: '3px solid var(--success-color)'
                    }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-success)', marginBottom: '10px' }}>{sol.step}</div>
                      <MathText text={sol.content} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 汎用テンプレートセクション */}
            <div>
              <div style={{
                background: 'linear-gradient(135deg, var(--bg-warning) 0%, var(--bg-accent) 100%)',
                borderRadius: '10px',
                padding: '20px',
                border: '2px dashed var(--border-warning)'
              }}>
                <h4 style={{
                  color: 'var(--text-warning)',
                  marginBottom: '15px',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    background: 'var(--border-warning)',
                    color: 'white',
                    padding: '3px 10px',
                    borderRadius: '5px',
                    fontSize: '0.85rem'
                  }}>汎用</span>
                  {currentSpace.template.title}
                </h4>

                {currentSpace.template.steps.map((step, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-card)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    borderLeft: '4px solid var(--accent-color)'
                  }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-accent)', marginBottom: '10px' }}>{step.step}</div>
                    <MathText text={step.content} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 合格のポイント */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'var(--success-light)',
        borderRadius: '12px',
        borderLeft: '4px solid var(--success-color)'
      }}>
        <h4 style={{ color: 'var(--text-success)', marginBottom: '12px' }}>🎯 この構成で書き込めば試験に勝てる！</h4>
        <ul style={{ color: 'var(--text-primary)', lineHeight: '1.8', paddingLeft: '20px', margin: 0 }}>
          <li><strong>仮説検定とベイズの定理だけで約30%</strong>の配点。この2つは完璧にする</li>
          <li>毎年ほぼ<strong>同じ形式・同じ問題</strong>が出る。数字を当てはめるだけで解ける</li>
          <li>記述問題の答えは<strong>一字一句同じ</strong>でOK。暗記して書き写すだけ</li>
          <li>試験中に「数字をどこに入れればいいんだっけ？」と迷うことがなくなる</li>
        </ul>
      </div>
    </div>
  );
}

// カンペ（一覧復習）タブ
function CheatSheetTab() {
  return (
    <div className="cheatsheet-tab">
      <h2>📋 試験直前カンペ</h2>
      <p className="tab-description">1ページで全重要事項を確認 ・ 印刷推奨</p>

      <div className="cheatsheet-content">
        <div className="cheat-section">
          <h3>📊 主要分布の期待値・分散</h3>
          <table className="cheat-table">
            <thead><tr><th>分布</th><th>E[X]</th><th>V[X]</th><th>用途</th></tr></thead>
            <tbody>
              <tr><td>二項 B(n,p)</td><td>np</td><td>np(1-p)</td><td>成功回数</td></tr>
              <tr><td>ポアソン Po(λ)</td><td>λ</td><td>λ</td><td>稀な事象</td></tr>
              <tr><td>幾何 Ge(p)</td><td>1/p</td><td>(1-p)/p²</td><td>初成功まで</td></tr>
              <tr><td>指数 Ex(λ)</td><td>1/λ</td><td>1/λ²</td><td>待ち時間</td></tr>
              <tr><td>正規 N(μ,σ²)</td><td>μ</td><td>σ²</td><td>連続量</td></tr>
            </tbody>
          </table>
        </div>

        <div className="cheat-section">
          <h3>🔢 必須暗記数値</h3>
          <div className="cheat-grid">
            <div className="cheat-item"><span className="cheat-label">z (片側5%)</span><span className="cheat-value">1.645</span></div>
            <div className="cheat-item"><span className="cheat-label">z (両側5%)</span><span className="cheat-value">1.96</span></div>
            <div className="cheat-item"><span className="cheat-label">z (両側1%)</span><span className="cheat-value">2.58</span></div>
            <div className="cheat-item"><span className="cheat-label">e⁻¹</span><span className="cheat-value">≈ 0.368</span></div>
            <div className="cheat-item"><span className="cheat-label">e⁻²</span><span className="cheat-value">≈ 0.135</span></div>
            <div className="cheat-item"><span className="cheat-label">e⁻³</span><span className="cheat-value">≈ 0.05</span></div>
          </div>
        </div>

        <div className="cheat-section">
          <h3>📐 標準正規分布の確率</h3>
          <div className="cheat-grid">
            <div className="cheat-item"><span className="cheat-label">P(|Z| ≤ 1)</span><span className="cheat-value">≈ 68%</span></div>
            <div className="cheat-item"><span className="cheat-label">P(|Z| ≤ 2)</span><span className="cheat-value">≈ 95%</span></div>
            <div className="cheat-item"><span className="cheat-label">P(|Z| ≤ 3)</span><span className="cheat-value">≈ 99.7%</span></div>
            <div className="cheat-item"><span className="cheat-label">P(Z ≤ 0)</span><span className="cheat-value">= 50%</span></div>
          </div>
        </div>

        <div className="cheat-section">
          <h3>⚡ 重要公式</h3>
          <div className="cheat-formulas">
            <div className="cheat-formula">
              <span className="formula-label">標準化:</span>
              <MathFormula>{"Z = \\frac{X - \\mu}{\\sigma}"}</MathFormula>
            </div>
            <div className="cheat-formula">
              <span className="formula-label">標本平均:</span>
              <MathFormula>{"Z = \\frac{\\bar{X} - \\mu}{\\sigma / \\sqrt{n}}"}</MathFormula>
            </div>
            <div className="cheat-formula">
              <span className="formula-label">信頼区間:</span>
              <MathFormula>{"\\bar{X} \\pm z_{\\alpha/2} \\cdot \\frac{\\sigma}{\\sqrt{n}}"}</MathFormula>
            </div>
            <div className="cheat-formula">
              <span className="formula-label">ベイズ:</span>
              <MathFormula>{"P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}"}</MathFormula>
            </div>
          </div>
        </div>

        <div className="cheat-section">
          <h3>⚠️ よくある間違い</h3>
          <ul className="cheat-mistakes">
            <li>標準化で σ² ではなく <strong>σ</strong> で割る</li>
            <li>V[aX+b] = a²V[X]（定数bは消える）</li>
            <li>V[X+Y] = V[X]+V[Y] は<strong>独立のとき限定</strong></li>
            <li>不偏分散は <strong>n-1</strong> で割る</li>
            <li>正規近似は np≥5 <strong>かつ</strong> n(1-p)≥5</li>
          </ul>
        </div>

        <div className="cheat-section">
          <h3>🔄 分布の近似条件</h3>
          <div className="cheat-approx">
            <div className="approx-item">
              <span className="approx-from">B(n,p)</span>
              <span className="approx-arrow">→</span>
              <span className="approx-to">Po(np)</span>
              <span className="approx-cond">n大, p小</span>
            </div>
            <div className="approx-item">
              <span className="approx-from">B(n,p)</span>
              <span className="approx-arrow">→</span>
              <span className="approx-to">N(np, np(1-p))</span>
              <span className="approx-cond">np≥5, n(1-p)≥5</span>
            </div>
            <div className="approx-item">
              <span className="approx-from">Po(λ)</span>
              <span className="approx-arrow">→</span>
              <span className="approx-to">N(λ, λ)</span>
              <span className="approx-cond">λ≥10</span>
            </div>
          </div>
        </div>
      </div>

      <button className="print-btn" onClick={() => window.print()}>🖨️ 印刷する</button>
    </div>
  );
}

// ベイズのツリー図コンポーネント
function BayesTreeDiagram() {
  return (
    <div className="visual-card">
      <h3>🌳 ベイズの定理 - ツリー図（樹形図）</h3>
      <p className="visual-desc">部品の供給元問題を視覚化</p>
      <div className="tree-diagram">
        <svg viewBox="0 0 600 300" className="tree-svg">
          {/* ルート */}
          <circle cx="50" cy="150" r="20" fill="#667eea"/>
          <text x="50" y="155" textAnchor="middle" fill="white" fontSize="12">全体</text>

          {/* A社の枝 */}
          <line x1="70" y1="150" x2="180" y2="50" stroke="#ff6b6b" strokeWidth="2"/>
          <text x="110" y="85" fill="#ff6b6b" fontSize="11">P(A)=0.15</text>
          <circle cx="200" cy="50" r="18" fill="#ff6b6b"/>
          <text x="200" y="54" textAnchor="middle" fill="white" fontSize="10">A社</text>

          {/* A社→不良品 */}
          <line x1="218" y1="50" x2="350" y2="30" stroke="#ff6b6b" strokeWidth="1.5"/>
          <text x="270" y="30" fill="#aaa" fontSize="9">P(E|A)=0.004</text>
          <rect x="360" y="15" width="80" height="30" rx="5" fill="rgba(255,107,107,0.3)" stroke="#ff6b6b"/>
          <text x="400" y="35" textAnchor="middle" fill="#ff6b6b" fontSize="10">0.0006</text>

          {/* B社の枝 */}
          <line x1="70" y1="150" x2="180" y2="150" stroke="#4ecdc4" strokeWidth="2"/>
          <text x="110" y="140" fill="#4ecdc4" fontSize="11">P(B)=0.35</text>
          <circle cx="200" cy="150" r="18" fill="#4ecdc4"/>
          <text x="200" y="154" textAnchor="middle" fill="white" fontSize="10">B社</text>

          {/* B社→不良品 */}
          <line x1="218" y1="150" x2="350" y2="130" stroke="#4ecdc4" strokeWidth="1.5"/>
          <text x="270" y="130" fill="#aaa" fontSize="9">P(E|B)=0.004</text>
          <rect x="360" y="115" width="80" height="30" rx="5" fill="rgba(78,205,196,0.3)" stroke="#4ecdc4"/>
          <text x="400" y="135" textAnchor="middle" fill="#4ecdc4" fontSize="10">0.0014</text>

          {/* C社の枝 */}
          <line x1="70" y1="150" x2="180" y2="250" stroke="#a55eea" strokeWidth="2"/>
          <text x="110" y="215" fill="#a55eea" fontSize="11">P(C)=0.50</text>
          <circle cx="200" cy="250" r="18" fill="#a55eea"/>
          <text x="200" y="254" textAnchor="middle" fill="white" fontSize="10">C社</text>

          {/* C社→不良品 */}
          <line x1="218" y1="250" x2="350" y2="230" stroke="#a55eea" strokeWidth="1.5"/>
          <text x="270" y="230" fill="#aaa" fontSize="9">P(E|C)=0.002</text>
          <rect x="360" y="215" width="80" height="30" rx="5" fill="rgba(165,94,234,0.3)" stroke="#a55eea"/>
          <text x="400" y="235" textAnchor="middle" fill="#a55eea" fontSize="10">0.0010</text>

          {/* 合計 */}
          <rect x="480" y="100" width="100" height="60" rx="8" fill="rgba(102,126,234,0.3)" stroke="#667eea" strokeWidth="2"/>
          <text x="530" y="125" textAnchor="middle" fill="#667eea" fontSize="11">P(E) = 合計</text>
          <text x="530" y="145" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">0.003</text>
        </svg>
      </div>
      <div className="visual-formula">
        <MathFormula>P(A|E) = \frac{0.0006}{0.003} = \frac{1}{5} = 20\%</MathFormula>
      </div>
    </div>
  );
}

// 正規分布の図コンポーネント
function NormalDistributionDiagram() {
  return (
    <div className="visual-card">
      <h3>🔔 正規分布と68-95-99.7ルール</h3>
      <p className="visual-desc">標準偏差ごとの区間確率を視覚化</p>
      <div className="normal-diagram">
        <svg viewBox="0 0 500 250" className="normal-svg">
          {/* 曲線 */}
          <path d="M 50 200 Q 100 200, 150 180 Q 200 140, 250 50 Q 300 140, 350 180 Q 400 200, 450 200"
                fill="none" stroke="#667eea" strokeWidth="3"/>

          {/* 1σ区間 */}
          <rect x="175" y="50" width="150" height="150" fill="rgba(102,126,234,0.3)"/>
          <text x="250" y="130" textAnchor="middle" fill="#667eea" fontSize="14" fontWeight="bold">68%</text>

          {/* 2σ区間 */}
          <rect x="125" y="50" width="50" height="150" fill="rgba(102,126,234,0.15)"/>
          <rect x="325" y="50" width="50" height="150" fill="rgba(102,126,234,0.15)"/>
          <text x="150" y="100" textAnchor="middle" fill="#888" fontSize="10">13.5%</text>
          <text x="350" y="100" textAnchor="middle" fill="#888" fontSize="10">13.5%</text>

          {/* 軸 */}
          <line x1="50" y1="200" x2="450" y2="200" stroke="#666" strokeWidth="1"/>

          {/* ラベル */}
          <text x="125" y="220" textAnchor="middle" fill="#888" fontSize="11">-2σ</text>
          <text x="175" y="220" textAnchor="middle" fill="#888" fontSize="11">-1σ</text>
          <text x="250" y="220" textAnchor="middle" fill="#fff" fontSize="12">μ</text>
          <text x="325" y="220" textAnchor="middle" fill="#888" fontSize="11">+1σ</text>
          <text x="375" y="220" textAnchor="middle" fill="#888" fontSize="11">+2σ</text>

          {/* 凡例 */}
          <text x="250" y="240" textAnchor="middle" fill="#4ecdc4" fontSize="11">±1σ: 68% | ±2σ: 95% | ±3σ: 99.7%</text>
        </svg>
      </div>
    </div>
  );
}

// 仮説検定フローチャート
function HypothesisTestFlowchart() {
  return (
    <div className="visual-card">
      <h3>⚖️ 仮説検定のフローチャート</h3>
      <p className="visual-desc">検定の手順を視覚的に理解</p>
      <div className="flowchart">
        <div className="flow-step start">
          <span>1. 仮説設定</span>
          <small>H₀: μ = μ₀（帰無仮説）</small>
          <small>H₁: μ ≠ μ₀（対立仮説）</small>
        </div>
        <div className="flow-arrow">↓</div>
        <div className="flow-step">
          <span>2. 有意水準α決定</span>
          <small>通常 α = 0.05 または 0.01</small>
        </div>
        <div className="flow-arrow">↓</div>
        <div className="flow-step">
          <span>3. 検定統計量Z計算</span>
          <small>Z = (X̄ - μ₀) / (σ/√n)</small>
        </div>
        <div className="flow-arrow">↓</div>
        <div className="flow-step decision">
          <span>4. 判定</span>
          <small>|Z| ≥ z(α/2) ?</small>
        </div>
        <div className="flow-branches">
          <div className="flow-branch yes">
            <span className="branch-label">Yes</span>
            <div className="flow-result reject">H₀を棄却</div>
          </div>
          <div className="flow-branch no">
            <span className="branch-label">No</span>
            <div className="flow-result accept">H₀を棄却できない</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 標本平均の収束図
function SampleMeanConvergence() {
  const [n, setN] = useState(1);
  const se = 1 / Math.sqrt(n);
  const barWidth = Math.max(5, 100 * se);

  return (
    <div className="visual-card">
      <h3>📉 中心極限定理 - サンプルサイズと分布</h3>
      <p className="visual-desc">スライダーを動かして標本平均の分布の変化を観察しよう</p>
      <div className="convergence-interactive">
        <div className="slider-container">
          <label>サンプルサイズ n = <strong>{n}</strong></label>
          <input
            type="range"
            min="1"
            max="100"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="n-slider"
          />
        </div>
        <div className="convergence-visual">
          <div className="conv-bar-interactive" style={{ width: `${barWidth}%` }}></div>
        </div>
        <div className="se-display">
          <span>標準誤差 SE = σ/√{n} = <strong>{se.toFixed(3)}σ</strong></span>
        </div>
        <div className="convergence-comparison">
          <div className="comparison-item"><span>n=1:</span> <div className="mini-bar" style={{width: '100%'}}></div></div>
          <div className="comparison-item"><span>n=4:</span> <div className="mini-bar" style={{width: '50%'}}></div></div>
          <div className="comparison-item"><span>n=25:</span> <div className="mini-bar" style={{width: '20%'}}></div></div>
          <div className="comparison-item"><span>n=100:</span> <div className="mini-bar" style={{width: '10%'}}></div></div>
        </div>
      </div>
      <div className="visual-note">
        💡 標準誤差 SE = σ/√n → サンプル4倍で精度2倍
      </div>
    </div>
  );
}

// Zスコア・偏差値計算機
function ZScoreCalculator() {
  const [val, setVal] = useState(70);
  const [mean, setMean] = useState(60);
  const [sd, setSd] = useState(10);

  const z = sd !== 0 ? (val - mean) / sd : 0;
  const tScore = z * 10 + 50;

  return (
    <div className="visual-card calculator-card">
      <h3>🧮 Zスコア・偏差値 計算機</h3>
      <p className="visual-desc">自分の値を入力して標準化スコアを確認しよう</p>
      <div className="calc-inputs">
        <div className="calc-row">
          <label>値 (X):</label>
          <input type="number" value={val} onChange={e => setVal(Number(e.target.value))} />
        </div>
        <div className="calc-row">
          <label>平均 (μ):</label>
          <input type="number" value={mean} onChange={e => setMean(Number(e.target.value))} />
        </div>
        <div className="calc-row">
          <label>標準偏差 (σ):</label>
          <input type="number" value={sd} onChange={e => setSd(Number(e.target.value))} step="0.1" />
        </div>
      </div>
      <div className="calc-formula">
        <MathFormula>{"Z = \\frac{X - \\mu}{\\sigma} = \\frac{" + val + " - " + mean + "}{" + sd + "} = " + z.toFixed(3)}</MathFormula>
      </div>
      <div className="calc-results">
        <div className="result-item">
          <span className="result-label">Zスコア</span>
          <span className="result-value" style={{color: z >= 0 ? 'var(--text-success)' : 'var(--text-danger)'}}>{z.toFixed(3)}</span>
        </div>
        <div className="result-item">
          <span className="result-label">偏差値</span>
          <span className="result-value">{tScore.toFixed(1)}</span>
        </div>
      </div>
      <div className="visual-note">
        💡 Z = (X-μ)/σ, 偏差値 = 10Z + 50
      </div>
    </div>
  );
}

// パラメータ整理テンプレート
function ParameterTemplate() {
  return (
    <div className="visual-card">
      <h3>📋 問題解法 - パラメータ整理テンプレート</h3>
      <p className="visual-desc">ベイズの問題を解くときの表形式整理</p>
      <table className="param-table">
        <thead>
          <tr>
            <th>供給元</th>
            <th>事前確率 P(·)</th>
            <th>尤度 P(E|·)</th>
            <th>積事象 P(·∩E)</th>
            <th>事後確率 P(·|E)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A社</td>
            <td>0.15</td>
            <td>0.004</td>
            <td>0.0006</td>
            <td>0.2 (20%)</td>
          </tr>
          <tr>
            <td>B社</td>
            <td>0.35</td>
            <td>0.004</td>
            <td>0.0014</td>
            <td>0.47 (47%)</td>
          </tr>
          <tr>
            <td>C社</td>
            <td>0.50</td>
            <td>0.002</td>
            <td>0.0010</td>
            <td>0.33 (33%)</td>
          </tr>
          <tr className="total-row">
            <td>合計</td>
            <td>1.00</td>
            <td>-</td>
            <td>0.003</td>
            <td>1.00</td>
          </tr>
        </tbody>
      </table>
      <div className="visual-note">
        💡 表を作ることで計算ミスを防ぎ、部分点も狙える！
      </div>
    </div>
  );
}

// 分布の形状比較
function DistributionShapes() {
  return (
    <div className="visual-card">
      <h3>📊 分布の形状比較</h3>
      <p className="visual-desc">各分布の特徴を視覚的に比較</p>
      <div className="dist-comparison">
        <div className="dist-item">
          <div className="dist-shape binomial">
            <div className="bar" style={{height: '20%'}}></div>
            <div className="bar" style={{height: '40%'}}></div>
            <div className="bar" style={{height: '60%'}}></div>
            <div className="bar" style={{height: '80%'}}></div>
            <div className="bar" style={{height: '100%'}}></div>
            <div className="bar" style={{height: '80%'}}></div>
            <div className="bar" style={{height: '60%'}}></div>
            <div className="bar" style={{height: '40%'}}></div>
            <div className="bar" style={{height: '20%'}}></div>
          </div>
          <span className="dist-name">二項分布 B(n,p)</span>
          <small>離散・左右対称(p=0.5時)</small>
        </div>
        <div className="dist-item">
          <div className="dist-shape poisson">
            <div className="bar" style={{height: '100%'}}></div>
            <div className="bar" style={{height: '80%'}}></div>
            <div className="bar" style={{height: '50%'}}></div>
            <div className="bar" style={{height: '25%'}}></div>
            <div className="bar" style={{height: '10%'}}></div>
            <div className="bar" style={{height: '5%'}}></div>
          </div>
          <span className="dist-name">ポアソン分布 Po(λ)</span>
          <small>離散・右に裾が長い</small>
        </div>
        <div className="dist-item">
          <div className="dist-shape normal">
            <svg viewBox="0 0 100 60">
              <path d="M 5 55 Q 25 55, 35 40 Q 45 15, 50 10 Q 55 15, 65 40 Q 75 55, 95 55"
                    fill="rgba(102,126,234,0.3)" stroke="#667eea" strokeWidth="2"/>
            </svg>
          </div>
          <span className="dist-name">正規分布 N(μ,σ²)</span>
          <small>連続・左右対称</small>
        </div>
      </div>
    </div>
  );
}

// t分布表・カイ二乗分布表 検索機能
function StatTableLookup() {
  const [tableType, setTableType] = useState('t');
  const [df, setDf] = useState(10);
  const [alpha, setAlpha] = useState(0.05);

  // t分布表（両側検定の臨界値）
  const tTable = {
    1: { 0.1: 6.314, 0.05: 12.706, 0.025: 25.452, 0.01: 63.657 },
    2: { 0.1: 2.920, 0.05: 4.303, 0.025: 6.205, 0.01: 9.925 },
    3: { 0.1: 2.353, 0.05: 3.182, 0.025: 4.177, 0.01: 5.841 },
    4: { 0.1: 2.132, 0.05: 2.776, 0.025: 3.495, 0.01: 4.604 },
    5: { 0.1: 2.015, 0.05: 2.571, 0.025: 3.163, 0.01: 4.032 },
    6: { 0.1: 1.943, 0.05: 2.447, 0.025: 2.969, 0.01: 3.707 },
    7: { 0.1: 1.895, 0.05: 2.365, 0.025: 2.841, 0.01: 3.499 },
    8: { 0.1: 1.860, 0.05: 2.306, 0.025: 2.752, 0.01: 3.355 },
    9: { 0.1: 1.833, 0.05: 2.262, 0.025: 2.685, 0.01: 3.250 },
    10: { 0.1: 1.812, 0.05: 2.228, 0.025: 2.634, 0.01: 3.169 },
    15: { 0.1: 1.753, 0.05: 2.131, 0.025: 2.490, 0.01: 2.947 },
    20: { 0.1: 1.725, 0.05: 2.086, 0.025: 2.423, 0.01: 2.845 },
    25: { 0.1: 1.708, 0.05: 2.060, 0.025: 2.385, 0.01: 2.787 },
    30: { 0.1: 1.697, 0.05: 2.042, 0.025: 2.360, 0.01: 2.750 },
    40: { 0.1: 1.684, 0.05: 2.021, 0.025: 2.329, 0.01: 2.704 },
    60: { 0.1: 1.671, 0.05: 2.000, 0.025: 2.299, 0.01: 2.660 },
    120: { 0.1: 1.658, 0.05: 1.980, 0.025: 2.270, 0.01: 2.617 },
    999: { 0.1: 1.645, 0.05: 1.960, 0.025: 2.241, 0.01: 2.576 }
  };

  // カイ二乗分布表
  const chiTable = {
    1: { 0.1: 2.706, 0.05: 3.841, 0.025: 5.024, 0.01: 6.635 },
    2: { 0.1: 4.605, 0.05: 5.991, 0.025: 7.378, 0.01: 9.210 },
    3: { 0.1: 6.251, 0.05: 7.815, 0.025: 9.348, 0.01: 11.345 },
    4: { 0.1: 7.779, 0.05: 9.488, 0.025: 11.143, 0.01: 13.277 },
    5: { 0.1: 9.236, 0.05: 11.070, 0.025: 12.833, 0.01: 15.086 },
    6: { 0.1: 10.645, 0.05: 12.592, 0.025: 14.449, 0.01: 16.812 },
    7: { 0.1: 12.017, 0.05: 14.067, 0.025: 16.013, 0.01: 18.475 },
    8: { 0.1: 13.362, 0.05: 15.507, 0.025: 17.535, 0.01: 20.090 },
    9: { 0.1: 14.684, 0.05: 16.919, 0.025: 19.023, 0.01: 21.666 },
    10: { 0.1: 15.987, 0.05: 18.307, 0.025: 20.483, 0.01: 23.209 },
    15: { 0.1: 22.307, 0.05: 24.996, 0.025: 27.488, 0.01: 30.578 },
    20: { 0.1: 28.412, 0.05: 31.410, 0.025: 34.170, 0.01: 37.566 },
    25: { 0.1: 34.382, 0.05: 37.652, 0.025: 40.646, 0.01: 44.314 },
    30: { 0.1: 40.256, 0.05: 43.773, 0.025: 46.979, 0.01: 50.892 }
  };

  const table = tableType === 't' ? tTable : chiTable;
  const availableDfs = Object.keys(table).map(Number).sort((a, b) => a - b);

  // 近い自由度を探す
  const closestDf = availableDfs.reduce((prev, curr) =>
    Math.abs(curr - df) < Math.abs(prev - df) ? curr : prev
  );

  const value = table[closestDf] ? table[closestDf][alpha] : null;

  return (
    <div className="visual-card calculator-card">
      <h3>📊 統計数表検索</h3>
      <p className="visual-desc">t分布・カイ二乗分布の臨界値を検索</p>
      <div className="calc-inputs">
        <div className="calc-row">
          <label>分布:</label>
          <select value={tableType} onChange={e => setTableType(e.target.value)}>
            <option value="t">t分布</option>
            <option value="chi">カイ二乗分布</option>
          </select>
        </div>
        <div className="calc-row">
          <label>自由度 (df):</label>
          <input type="number" min="1" max="120" value={df} onChange={e => setDf(Number(e.target.value))} />
        </div>
        <div className="calc-row">
          <label>有意水準 (α):</label>
          <select value={alpha} onChange={e => setAlpha(Number(e.target.value))}>
            <option value="0.1">0.10 (10%)</option>
            <option value="0.05">0.05 (5%)</option>
            <option value="0.025">0.025 (2.5%)</option>
            <option value="0.01">0.01 (1%)</option>
          </select>
        </div>
      </div>
      <div className="calc-results">
        <div className="result-item">
          <span className="result-label">
            {tableType === 't' ? `t(${closestDf}, ${alpha})` : `χ²(${closestDf}, ${alpha})`}
          </span>
          <span className="result-value">{value !== null ? value.toFixed(3) : 'N/A'}</span>
        </div>
        {df !== closestDf && (
          <div className="result-note">※ df={closestDf} の値を表示（近似値）</div>
        )}
      </div>
      <div className="visual-note">
        💡 {tableType === 't' ? 't分布は両側検定の臨界値' : 'カイ二乗分布は右側検定の臨界値'}
      </div>
    </div>
  );
}

// 視覚学習タブ
function VisualLearningTab() {
  return (
    <div className="visual-tab">
      <h2>📊 視覚的に学ぶ統計学</h2>
      <p className="tab-description">図と表で直感的に理解しよう</p>

      <h3 className="section-subtitle">🔧 計算ツール</h3>
      <div className="visual-grid tools-grid">
        <ZScoreCalculator />
        <StatTableLookup />
      </div>

      <h3 className="section-subtitle">📈 視覚的解説</h3>
      <div className="visual-grid">
        <BayesTreeDiagram />
        <NormalDistributionDiagram />
        <DistributionShapes />
        <HypothesisTestFlowchart />
        <SampleMeanConvergence />
        <ParameterTemplate />
      </div>
    </div>
  );
}

function LearnTab({ sections, openSections, toggleSection, expandAll, collapseAll }) {
  return (
    <div className="learn-tab">
      <div className="controls">
        <button className="expand-btn" onClick={expandAll}>📂 すべて展開</button>
        <button className="collapse-btn" onClick={collapseAll}>📁 折りたたむ</button>
      </div>
      
      {sections.map(section => (
        <Section
          key={section.id}
          section={section}
          isOpen={openSections.has(section.id)}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  );
}

// ===== メインApp =====
function App() {
  const [activeTab, setActiveTab] = useState('learn');
  const [openSections, setOpenSections] = useState(new Set([1]));
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('stats-dark-mode');
      return saved === 'true';
    } catch { return false; }
  });

  useEffect(() => {
    try {
      localStorage.setItem('stats-dark-mode', darkMode);
    } catch {}
  }, [darkMode]);

  const toggleSection = (id) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenSections(new Set(sections.map(s => s.id)));
  const collapseAll = () => setOpenSections(new Set());

  const totalProblems = sections.reduce((sum, s) => sum + s.problems.length, 0);

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        /* CSS変数（ライトモード） */
        .app {
          --bg-primary: #f1f5f9;
          --bg-secondary: white;
          --bg-card: white;
          --bg-accent: #f0fdfa;
          --bg-tertiary: #f8fafc;
          --bg-warning: #fffbeb;
          --bg-success: #f0fdf4;
          --bg-danger: #fef2f2;
          --text-primary: #334155;
          --text-secondary: #64748b;
          --text-accent: #0f766e;
          --text-warning: #92400e;
          --text-success: #166534;
          --text-danger: #dc2626;
          --border-color: #e2e8f0;
          --border-warning: #fbbf24;
          --border-success: #22c55e;
          --border-danger: #ef4444;
          --accent-color: #14b8a6;
          --accent-dark: #0f766e;
          --accent-light: #99f6e4;
          --info-bg: #eff6ff;
          --info-border: #3b82f6;
          --success-light: #dcfce7;
          --shadow-color: rgba(0,0,0,0.1);
          --formula-bg: rgba(0,0,0,0.08);
        }

        /* ダークモード */
        .app.dark {
          --bg-primary: #0f172a;
          --bg-secondary: #1e293b;
          --bg-card: #1e293b;
          --bg-accent: #134e4a;
          --bg-tertiary: #1e293b;
          --bg-warning: #422006;
          --bg-success: #14532d;
          --bg-danger: #450a0a;
          --text-primary: #e2e8f0;
          --text-secondary: #94a3b8;
          --text-accent: #5eead4;
          --text-warning: #fcd34d;
          --text-success: #86efac;
          --text-danger: #fca5a5;
          --border-color: #334155;
          --border-warning: #f59e0b;
          --border-success: #10b981;
          --border-danger: #f87171;
          --accent-color: #2dd4bf;
          --accent-dark: #14b8a6;
          --accent-light: #134e4a;
          --info-bg: #1e3a5f;
          --info-border: #60a5fa;
          --success-light: #14532d;
          --shadow-color: rgba(0,0,0,0.3);
          --formula-bg: rgba(255,255,255,0.1);
        }

        /* MathJax数式スタイル */
        .math-display {
          overflow-x: auto;
          padding: 10px 0;
          text-align: center;
          font-size: 2em;
        }
        .math-inline {
          display: inline-block;
          vertical-align: middle;
          font-size: 2em;
        }
        .formula-eq {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60px;
          padding: 10px;
          background: var(--formula-bg);
          border-radius: 8px;
          margin: 10px 0;
        }
        .ref-item {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .app {
          min-height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
          font-family: 'Noto Sans JP', sans-serif;
          transition: background 0.3s, color 0.3s;
        }

        .header {
          text-align: center;
          padding: 40px 20px 20px;
          background: linear-gradient(135deg, var(--bg-accent) 0%, var(--bg-secondary) 100%);
          border-bottom: 1px solid var(--border-color);
          position: relative;
        }

        .header h1 {
          font-size: 2.5rem;
          color: var(--text-accent);
          margin-bottom: 10px;
        }

        .header .stats {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-top: 15px;
          color: var(--text-secondary);
        }

        .header .stat-number {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-accent);
        }

        .dark-toggle {
          position: absolute;
          top: 15px;
          right: 20px;
          padding: 8px 16px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 1.2rem;
          background: var(--bg-card);
          color: var(--text-primary);
          box-shadow: 0 2px 8px var(--shadow-color);
          transition: all 0.3s;
        }

        .dark-toggle:hover {
          transform: scale(1.1);
        }

        .tab-nav {
          display: flex;
          justify-content: center;
          gap: 10px;
          padding: 15px 20px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
          flex-wrap: wrap;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 5px var(--shadow-color);
        }

        .tab-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-family: inherit;
          font-size: 1rem;
          background: var(--border-color);
          color: var(--text-secondary);
          transition: all 0.3s;
        }

        .tab-btn.active {
          background: var(--accent-color);
          color: white;
        }

        .tab-btn:hover:not(.active) {
          background: var(--bg-accent);
        }

        .main-content {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .controls {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .controls button {
          padding: 10px 24px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.3s;
        }

        .expand-btn {
          background: var(--accent-color);
          color: white;
        }

        .collapse-btn {
          background: var(--border-color);
          color: var(--text-secondary);
        }

        .section {
          margin-bottom: 15px;
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          overflow: hidden;
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .section:hover {
          border-color: var(--section-color);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          cursor: pointer;
        }

        .section-header:hover {
          background: var(--bg-tertiary);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .section-icon { font-size: 1.8rem; }

        .section-title h2 {
          font-size: 1.25rem;
          color: var(--section-color);
        }

        .section-meta {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .problem-count {
          background: var(--section-color);
          color: #fff;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.85rem;
        }

        .arrow {
          color: var(--text-secondary);
          transition: transform 0.3s;
        }

        .arrow.open { transform: rotate(180deg); }

        .section-content {
          padding: 0 25px 25px;
        }

        .sub-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .sub-tabs button {
          padding: 8px 16px;
          border: 1px solid var(--border-color);
          border-radius: 15px;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .sub-tabs button.active {
          background: var(--section-color);
          color: white;
          border-color: var(--section-color);
        }

        .theory-section > div {
          margin-bottom: 20px;
          padding: 18px;
          border-radius: 12px;
        }

        .theory-background {
          background: var(--bg-accent);
          border-left: 4px solid var(--accent-color);
        }

        .theory-insight {
          background: var(--bg-success);
          border-left: 4px solid var(--border-success);
        }

        .theory-mistakes {
          background: var(--bg-danger);
          border-left: 4px solid var(--border-danger);
        }

        .theory-section h4 {
          margin-bottom: 10px;
          color: inherit;
        }

        .theory-background h4 { color: var(--text-accent); }
        .theory-insight h4 { color: var(--text-success); }
        .theory-mistakes h4 { color: var(--text-danger); }

        .theory-mistakes ul {
          list-style: none;
          padding-left: 0;
        }

        .theory-mistakes li {
          padding: 8px 0 8px 25px;
          position: relative;
          color: var(--text-danger);
        }

        .theory-mistakes li::before {
          content: '⚠';
          position: absolute;
          left: 0;
        }

        .concepts-section {
          background: var(--bg-accent);
          padding: 18px;
          border-radius: 12px;
        }

        .concepts-section h4 {
          color: var(--text-accent);
          margin-bottom: 12px;
        }

        .concepts-list {
          list-style: none;
        }

        .concepts-list li {
          padding: 8px 0 8px 25px;
          position: relative;
          color: var(--text-secondary);
        }

        .concepts-list li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--text-accent);
        }

        .formulas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 12px;
        }

        .formula-card {
          padding: 15px;
          border-radius: 12px;
          background: var(--bg-accent);
          border: 1px solid var(--border-color);
        }

        .formula-card.importance-3 {
          border-color: var(--border-warning);
          background: var(--bg-warning);
        }

        .formula-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .formula-name {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .importance {
          color: var(--text-warning);
          font-size: 0.8rem;
        }

        .formula-eq {
          font-family: 'JetBrains Mono', monospace;
          font-size: 1rem;
          color: var(--text-accent);
          display: block;
          margin-bottom: 5px;
        }

        .formula-eq .math-display, .formula-eq .math-inline {
          font-size: 1em;
        }

        .formula-note {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .procedure-section {
          background: var(--info-bg);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid var(--info-border);
        }

        .procedure-section h4 {
          color: var(--text-accent);
          margin-bottom: 15px;
        }

        .procedure-list {
          list-style: none;
          counter-reset: step;
        }

        .procedure-list li {
          padding: 8px 0;
          color: var(--text-secondary);
        }

        .procedure-list li.step {
          font-weight: 500;
          color: var(--text-primary);
        }

        .procedure-list li.check {
          color: var(--text-success);
        }

        .procedure-list li.warning {
          color: var(--text-warning);
          font-weight: 500;
        }

        .procedure-list li.sub {
          padding-left: 20px;
          font-size: 0.95rem;
        }

        .problems-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 15px;
        }

        .problem-card {
          background: var(--bg-card);
          border-radius: 14px;
          padding: 20px;
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .problem-card:hover {
          border-color: var(--card-color);
        }

        .problem-header {
          margin-bottom: 12px;
        }

        .problem-number {
          background: var(--card-color);
          color: #fff;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.85rem;
        }

        .problem-question {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--text-primary);
          margin-bottom: 15px;
        }

        .problem-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .problem-buttons button {
          padding: 8px 18px;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
          background: var(--border-color);
          color: var(--text-secondary);
          transition: all 0.3s;
        }

        .hint-btn.active {
          background: var(--bg-warning);
          color: var(--text-warning);
        }

        .solution-btn.active {
          background: var(--success-light);
          color: var(--text-success);
        }

        .hint-box {
          background: var(--bg-warning);
          border-left: 4px solid var(--border-warning);
          padding: 15px;
          border-radius: 0 10px 10px 0;
          margin: 15px 0;
          line-height: 1.6;
        }

        .solution-box {
          background: var(--bg-success);
          border-left: 4px solid var(--border-success);
          padding: 15px;
          border-radius: 0 10px 10px 0;
          margin: 15px 0;
        }

        .solution-content pre {
          font-family: 'JetBrains Mono', monospace;
          white-space: pre-wrap;
          margin: 10px 0;
          padding: 15px;
          background: var(--bg-tertiary);
          border-radius: 8px;
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--text-primary);
        }

        .answer-box {
          margin-top: 15px;
          padding: 12px 15px;
          background: var(--success-light);
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          color: var(--text-success);
        }

        .insight-box {
          margin-top: 12px;
          padding: 12px 15px;
          background: var(--bg-accent);
          border-radius: 8px;
          font-size: 0.9rem;
          color: var(--text-accent);
        }

        /* Formulas Tab */
        .formulas-tab, .relations-tab, .checklist-tab, .essential-tab, .glossary-tab {
          padding: 20px 0;
        }

        .formulas-tab h2, .relations-tab h2, .checklist-tab h2, .essential-tab h2, .glossary-tab h2 {
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 10px;
          color: var(--text-accent);
        }

        .tab-description {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 25px;
        }

        /* Essential Formulas Table */
        .essential-table-container, .approx-table-container {
          overflow-x: auto;
          margin: 20px 0;
        }

        .essential-table, .approx-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--bg-card);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .essential-table th, .approx-table th {
          background: var(--accent-color);
          color: white;
          padding: 15px 10px;
          text-align: left;
          font-weight: 600;
        }

        .essential-table td, .approx-table td {
          padding: 12px 10px;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .essential-table tr:hover, .approx-table tr:hover {
          background: var(--bg-accent);
        }

        .category-cell { color: var(--text-accent); font-weight: 500; }
        .name-cell { font-weight: 500; }
        .formula-cell { min-width: 200px; }
        .formula-cell .math-inline { font-size: 1em; }
        .importance-cell { color: var(--text-warning); text-align: center; }
        .note-cell { color: var(--text-secondary); font-size: 0.9rem; }

        /* Glossary */
        .glossary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .glossary-card {
          background: var(--bg-card);
          padding: 20px;
          border-radius: 15px;
          border-left: 4px solid var(--accent-color);
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .glossary-term {
          color: var(--text-accent);
          font-size: 1.1rem;
          margin-bottom: 10px;
        }

        .glossary-definition {
          color: var(--text-primary);
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .glossary-example {
          color: var(--text-secondary);
          font-size: 0.9rem;
          padding-top: 10px;
          border-top: 1px solid var(--border-color);
        }

        .section-subtitle {
          color: var(--text-accent);
          font-size: 1.3rem;
          margin: 30px 0 15px;
        }

        .quick-ref-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .ref-category {
          background: var(--bg-card);
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .ref-category h4 {
          color: var(--text-accent);
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-color);
        }

        .ref-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ref-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .ref-item code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
          color: var(--text-accent);
          background: var(--bg-accent);
          padding: 6px 10px;
          border-radius: 6px;
        }

        .ref-item span {
          font-size: 0.8rem;
          color: var(--text-secondary);
          padding-left: 10px;
        }

        /* Relations Tab */
        .relations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .relation-card {
          background: var(--bg-card);
          border-radius: 15px;
          padding: 20px;
          border: 1px solid var(--border-color);
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .relation-flow {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .dist-from, .dist-to {
          background: var(--bg-accent);
          color: var(--text-accent);
          padding: 8px 15px;
          border-radius: 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
        }

        .arrow-right {
          color: var(--text-accent);
          font-size: 1.5rem;
        }

        .relation-condition, .relation-desc, .relation-example {
          margin: 8px 0;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .relation-condition strong, .relation-desc strong, .relation-example strong {
          color: var(--text-accent);
        }

        .approximation-summary {
          background: var(--bg-warning);
          border-radius: 15px;
          padding: 25px;
          border: 1px solid var(--border-warning);
        }

        .approximation-summary h3 {
          color: var(--text-warning);
          margin-bottom: 20px;
          text-align: center;
        }

        .flow-chart {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .flow-box {
          background: var(--bg-accent);
          color: var(--text-accent);
          padding: 15px 30px;
          border-radius: 10px;
          font-family: 'JetBrains Mono', monospace;
        }

        .flow-branch {
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .flow-path {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .flow-condition {
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          padding: 10px 15px;
          border-radius: 8px;
        }

        .flow-arrow {
          color: var(--text-accent);
          font-size: 1.5rem;
        }

        .flow-result {
          background: var(--success-light);
          color: var(--text-success);
          padding: 12px 20px;
          border-radius: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.9rem;
        }

        /* Checklist Tab */
        .progress-bar {
          background: var(--border-color);
          border-radius: 10px;
          height: 30px;
          margin-bottom: 25px;
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-color), var(--border-success));
          transition: width 0.5s ease;
          border-radius: 10px;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 0.9rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .checklist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .checklist-category {
          background: var(--bg-card);
          padding: 20px;
          border-radius: 15px;
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .checklist-category h4 {
          color: var(--text-accent);
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--border-color);
        }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          margin: 5px 0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .checklist-item:hover {
          background: var(--bg-tertiary);
        }

        .checklist-item.checked {
          background: var(--success-light);
        }

        .checklist-item.checked span {
          text-decoration: line-through;
          color: var(--text-secondary);
        }

        .checklist-item input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .checklist-item span {
          flex: 1;
          font-size: 0.95rem;
        }

        .critical-badge {
          background: var(--border-danger);
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.75rem;
        }

        .checklist-item.critical {
          border-left: 3px solid var(--border-danger);
        }

        /* 視覚学習タブのスタイル */
        .visual-tab {
          max-width: 1200px;
          margin: 0 auto;
        }

        .visual-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 20px;
        }

        .visual-card {
          background: var(--bg-card);
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 4px 15px var(--shadow-color);
        }

        .visual-card h3 {
          color: var(--text-accent);
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .visual-desc {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .diagram-container {
          display: flex;
          justify-content: center;
          margin: 15px 0;
        }

        .visual-formula .math-inline {
          font-size: 1em;
        }

        .diagram-container svg {
          max-width: 100%;
          height: auto;
        }

        .tree-legend, .normal-legend, .shape-legend, .flowchart-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 15px;
          padding: 10px;
          background: var(--bg-tertiary);
          border-radius: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }

        .flowchart-container {
          overflow-x: auto;
        }

        .convergence-controls {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }

        .convergence-controls label {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .convergence-controls input[type="range"] {
          width: 200px;
        }

        .convergence-controls button {
          padding: 8px 16px;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .convergence-controls button:hover {
          background: var(--accent-dark);
        }

        .convergence-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          margin-top: 15px;
        }

        .stat-item {
          background: var(--bg-accent);
          padding: 10px;
          border-radius: 8px;
          text-align: center;
        }

        .stat-item .label {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .stat-item .value {
          font-size: 1.2rem;
          font-weight: bold;
          color: var(--text-accent);
        }

        .param-table {
          width: 100%;
          border-collapse: collapse;
        }

        .param-table th, .param-table td {
          padding: 10px;
          border: 1px solid var(--border-color);
          text-align: center;
        }

        .param-table th {
          background: var(--accent-color);
          color: white;
        }

        .param-table tr:nth-child(even) {
          background: var(--bg-accent);
        }

        /* インタラクティブ中心極限定理 */
        .convergence-interactive {
          padding: 20px;
          background: var(--bg-tertiary);
          border-radius: 10px;
        }

        .slider-container {
          margin-bottom: 20px;
        }

        .slider-container label {
          display: block;
          margin-bottom: 10px;
          color: var(--text-primary);
        }

        .n-slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: var(--border-color);
          outline: none;
          -webkit-appearance: none;
        }

        .n-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent-color);
          cursor: pointer;
        }

        .convergence-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60px;
          background: var(--info-bg);
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .conv-bar-interactive {
          height: 40px;
          background: linear-gradient(90deg, var(--accent-color), var(--accent-light));
          border-radius: 20px;
          transition: width 0.3s ease;
        }

        .se-display {
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          color: var(--text-accent);
          margin-bottom: 15px;
        }

        .convergence-comparison {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 10px;
          background: var(--bg-card);
          border-radius: 8px;
        }

        .comparison-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .comparison-item span {
          width: 50px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-family: 'JetBrains Mono', monospace;
        }

        .mini-bar {
          height: 12px;
          background: linear-gradient(90deg, var(--text-secondary), var(--border-color));
          border-radius: 6px;
        }

        /* 計算ツール */
        .tools-grid {
          margin-bottom: 30px;
        }

        .calculator-card {
          background: linear-gradient(135deg, var(--bg-accent) 0%, var(--accent-light) 100%);
        }

        .calc-inputs {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 15px;
        }

        .calc-row {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .calc-row label {
          min-width: 120px;
          color: var(--text-primary);
          font-weight: 500;
        }

        .calc-row input, .calc-row select {
          flex: 1;
          padding: 8px 12px;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          font-size: 1rem;
          max-width: 200px;
          background: var(--bg-card);
          color: var(--text-primary);
        }

        .calc-row input:focus, .calc-row select:focus {
          outline: none;
          border-color: var(--text-accent);
        }

        .calc-formula {
          text-align: center;
          padding: 15px;
          background: var(--bg-card);
          border-radius: 8px;
          margin-bottom: 15px;
          color: var(--text-primary);
        }

        .calc-formula .math-inline {
          font-size: 1.3em;
        }

        .calc-results {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .result-item {
          text-align: center;
          padding: 15px 25px;
          background: var(--bg-card);
          border-radius: 10px;
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .result-label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 5px;
        }

        .result-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-accent);
          font-family: 'JetBrains Mono', monospace;
        }

        .result-note {
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-warning);
          margin-top: 10px;
        }

        .section-subtitle {
          color: var(--text-accent);
          margin: 25px 0 15px;
          font-size: 1.2rem;
        }

        .visual-note {
          margin-top: 15px;
          padding: 12px 15px;
          background: var(--bg-warning);
          border-radius: 8px;
          color: var(--text-warning);
          font-size: 0.9rem;
        }

        .total-row {
          font-weight: 600;
          background: var(--bg-accent) !important;
        }

        .footer {
          text-align: center;
          padding: 40px;
          color: var(--text-secondary);
        }

        .footer .emoji {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        /* チェックリストヘッダー */
        .checklist-header {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 20px;
        }

        .checklist-header .progress-bar {
          flex: 1;
          margin-bottom: 0;
        }

        .reset-btn {
          padding: 8px 16px;
          background: var(--border-danger);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .reset-btn:hover {
          background: var(--text-danger);
        }

        /* クイズタブ */
        .quiz-tab {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .quiz-stats {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .quiz-progress {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-accent);
        }

        .quiz-score {
          padding: 5px 12px;
          border-radius: 20px;
          font-weight: 500;
        }

        .quiz-score.correct {
          background: var(--success-light);
          color: var(--text-success);
        }

        .quiz-score.incorrect {
          background: var(--bg-danger);
          color: var(--text-danger);
        }

        .shuffle-btn {
          padding: 8px 16px;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .quiz-card {
          background: var(--bg-card);
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 4px 15px var(--shadow-color);
          text-align: center;
        }

        .quiz-question h3 {
          color: var(--text-accent);
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .quiz-question p {
          color: var(--text-primary);
          margin-bottom: 25px;
          line-height: 1.6;
        }

        .quiz-choices {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .quiz-choice {
          padding: 15px 20px;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: 10px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
          color: var(--text-primary);
        }

        .quiz-choice:hover:not(:disabled) {
          border-color: var(--text-accent);
          background: var(--bg-accent);
        }

        .quiz-choice:disabled {
          cursor: default;
        }

        .quiz-choice.correct {
          background: var(--success-light);
          border-color: var(--border-success);
          color: var(--text-success);
        }

        .quiz-choice.wrong {
          background: var(--bg-danger);
          border-color: var(--border-danger);
          color: var(--text-danger);
        }

        .next-btn {
          padding: 12px 30px;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          margin-top: 10px;
        }

        .next-btn:hover {
          background: var(--accent-dark);
        }

        .quiz-result {
          background: var(--bg-card);
          border-radius: 15px;
          padding: 40px;
          text-align: center;
          box-shadow: 0 4px 15px var(--shadow-color);
        }

        .quiz-result h3 {
          font-size: 2rem;
          margin-bottom: 20px;
        }

        .result-score {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-accent);
        }

        .retry-btn {
          margin-top: 20px;
          padding: 15px 40px;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          cursor: pointer;
        }

        .retry-btn.secondary {
          background: var(--bg-tertiary);
          color: var(--text-primary);
          border: 2px solid var(--border-color);
          margin-left: 10px;
        }

        .retry-btn.secondary:hover {
          background: var(--bg-accent);
          border-color: var(--accent-color);
        }

        .result-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* カテゴリ選択グリッド */
        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 15px;
          margin: 30px 0;
        }

        .category-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 15px;
          background: var(--bg-card);
          border: 2px solid var(--border-color);
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .category-btn:hover {
          border-color: var(--accent-color);
          background: var(--bg-accent);
          transform: translateY(-3px);
          box-shadow: 0 4px 15px var(--shadow-color);
        }

        .category-icon {
          font-size: 2.5rem;
          margin-bottom: 10px;
        }

        .category-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          text-align: center;
          margin-bottom: 5px;
        }

        .category-count {
          font-size: 0.85rem;
          color: var(--text-secondary);
          padding: 3px 10px;
          background: var(--bg-tertiary);
          border-radius: 12px;
        }

        .category-tip {
          background: var(--bg-accent);
          border: 1px solid var(--accent-color);
          border-radius: 10px;
          padding: 15px 20px;
          margin-top: 20px;
        }

        .category-tip p {
          margin: 0;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        /* カンペタブ */
        .cheatsheet-tab {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .cheatsheet-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .cheat-section {
          background: var(--bg-card);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px var(--shadow-color);
        }

        .cheat-section h3 {
          color: var(--text-accent);
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .cheat-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        .cheat-table th, .cheat-table td {
          padding: 8px;
          border: 1px solid var(--border-color);
          text-align: center;
        }

        .cheat-table th {
          background: var(--accent-color);
          color: white;
        }

        .cheat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .cheat-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: var(--bg-accent);
          border-radius: 6px;
        }

        .cheat-label {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .cheat-value {
          font-weight: 600;
          color: var(--text-accent);
          font-family: 'JetBrains Mono', monospace;
        }

        .cheat-formulas {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cheat-formula {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: var(--bg-accent);
          border-radius: 8px;
          overflow-x: auto;
        }

        .cheat-formula .formula-label {
          color: var(--text-secondary);
          font-size: 0.85rem;
          min-width: 70px;
          flex-shrink: 0;
        }

        .cheat-formula .math-inline {
          font-size: 0.9em;
        }

        .cheat-mistakes {
          list-style: none;
          padding: 0;
        }

        .cheat-mistakes li {
          padding: 8px 0;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-secondary);
        }

        .cheat-mistakes li:last-child {
          border-bottom: none;
        }

        .cheat-mistakes strong {
          color: var(--text-danger);
        }

        .cheat-approx {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .approx-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: var(--bg-accent);
          border-radius: 6px;
          font-size: 0.9rem;
        }

        .approx-from, .approx-to {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          color: var(--text-accent);
        }

        .approx-arrow {
          color: var(--text-accent);
        }

        .approx-cond {
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin-left: auto;
        }

        .print-btn {
          display: block;
          margin: 30px auto 0;
          padding: 15px 40px;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          cursor: pointer;
        }

        /* 印刷用スタイル */
        @media print {
          .app {
            background: white !important;
          }
          .header, .tab-nav, .footer, .print-btn {
            display: none !important;
          }
          .main-content {
            padding: 0 !important;
          }
          .cheatsheet-tab {
            max-width: 100% !important;
          }
          .cheat-section {
            break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #ddd;
          }
          .cheatsheet-content {
            display: block;
          }
          .cheat-section {
            margin-bottom: 15px;
          }
        }

        @media (max-width: 768px) {
          /* ヘッダー調整 */
          .header {
            padding-top: 50px;
          }
          .header h1 { font-size: 1.5rem; }
          .header .stats { gap: 15px; font-size: 0.9rem; }
          .dark-toggle {
            top: 10px;
            right: 10px;
            padding: 6px 12px;
            font-size: 1rem;
          }

          /* タブナビを横スクロールに */
          .tab-nav {
            justify-content: flex-start;
            flex-wrap: nowrap;
            overflow-x: auto;
            padding: 10px 15px;
            gap: 8px;
            -webkit-overflow-scrolling: touch;
          }
          .tab-nav::-webkit-scrollbar {
            display: none;
          }
          .tab-btn {
            flex: 0 0 auto;
            white-space: nowrap;
            padding: 10px 16px;
            font-size: 0.85rem;
          }

          /* グリッドを1列に */
          .formulas-grid, .problems-grid, .relations-grid, .checklist-grid, .visual-grid {
            grid-template-columns: 1fr;
          }
          .visual-grid { grid-template-columns: 1fr; }
          .quiz-choices { grid-template-columns: 1fr; }
          .cheat-grid { grid-template-columns: 1fr; }
          .convergence-controls { flex-direction: column; align-items: flex-start; }

          /* 計算ツール調整 */
          .calc-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .calc-row input, .calc-row select {
            max-width: 100%;
            width: 100%;
          }
          .calc-formula .math-inline {
            font-size: 1em;
          }

          /* セクション調整 */
          .section-header {
            padding: 15px;
          }
          .section-content {
            padding: 15px;
          }

          /* フッター */
          .footer {
            padding: 20px 15px;
          }
        }
      `}</style>

      <header className="header">
        <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
        <h1>📚 数理情報Ⅱ 完全対策</h1>
        <p style={{color: 'var(--text-secondary)'}}>確率・統計の理論から例題まで徹底解説</p>
        <div className="stats">
          <div><span className="stat-number">{sections.length}</span> セクション</div>
          <div><span className="stat-number">{totalProblems}</span> 例題</div>
          <div><span className="stat-number">{sections.reduce((sum, s) => sum + s.formulas.length, 0)}</span> 公式</div>
        </div>
      </header>

      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content">
        {activeTab === 'learn' && (
          <LearnTab 
            sections={sections}
            openSections={openSections}
            toggleSection={toggleSection}
            expandAll={expandAll}
            collapseAll={collapseAll}
          />
        )}
        {activeTab === 'formulas' && <FormulasTab />}
        {activeTab === 'essential' && <EssentialFormulasTab />}
        {activeTab === 'glossary' && <GlossaryTab />}
        {activeTab === 'relations' && <RelationsTab />}
        {activeTab === 'visual' && <VisualLearningTab />}
        {activeTab === 'quiz' && <QuizTab />}
        {activeTab === 'exam' && <ExamTab />}
        {activeTab === 'cheatsheet' && <CheatSheetTab />}
        {activeTab === 'checklist' && <ChecklistTab />}
      </main>

      <footer className="footer">
        <div className="emoji">🎓✨</div>
        <p>しっかり準備して試験に臨もう！合格を祈っています！</p>
      </footer>
    </div>
  );
}
