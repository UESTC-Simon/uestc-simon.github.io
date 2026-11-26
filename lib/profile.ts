export type Lang = "en" | "zh";

export type Bilingual = {
  en: string;
  zh: string;
};

export const bi = (en: string, zh: string): Bilingual => ({ en, zh });

export type SocialLink = {
  label: string;
  url: string;
  kind: "github" | "scholar";
};

export type NewsItem = {
  date: string;
  kind: "accepted" | "submission" | "progress";
  badge: Bilingual;
  text: Bilingual;
  href: string;
};

export type Publication = {
  id: string;
  year: string;
  title: string;
  tag: string;
  tagLabel: Bilingual;
  venue: Bilingual;
  statusTone: "accepted" | "review";
  role: Bilingual;
  authors: string;
  artKind: "cad" | "flow" | "network";
  plateMarker: string;
  homeTitle: Bilingual;
  homeLabel: string;
  homeSummary: Bilingual;
  abstract: Bilingual;
  contribution: Bilingual;
  url: string;
  codeUrl?: string;
  bibtex: string;
};

export type ProjectMilestone = {
  phase: Bilingual;
  text: Bilingual;
};

export type Project = {
  id: string;
  number: string;
  stage: "active" | "graduated" | "conjecture";
  title: Bilingual;
  subtitle: Bilingual;
  status: Bilingual;
  kind: "geometry" | "neuron" | "loops";
  tags: string[];
  description: Bilingual;
  details: Bilingual;
  milestones?: ProjectMilestone[];
  links?: { label: Bilingual; href: string; external?: boolean }[];
};

export const profile = {
  name: "Shiteng Lu",
  nameZh: "路仕腾",
  initials: "SL",
  email: "simonlu0306@gmail.com",
  siteUrl: "https://uestc-simon.github.io",
  github: "https://github.com/UESTC-Simon",
  socialLinks: [
    {
      label: "GitHub",
      url: "https://github.com/UESTC-Simon",
      kind: "github",
    },
    {
      label: "Google Scholar",
      url: "https://scholar.google.com/citations?user=jT3St9kAAAAJ&hl=zh-CN",
      kind: "scholar",
    },
  ] as SocialLink[],
  updated: "2026-11-26",
  role: bi(
    "Undergraduate at UESTC · Research Intern at Tsinghua",
    "电子科技大学本科生 · 清华大学科研实习生",
  ),
  shortBio: bi(
    "Exploring reliable AI, geometric evaluation, and how intelligence learns, remembers, and adapts.",
    "探索可靠的人工智能与几何评测，也好奇智能如何学习、记忆与适应。",
  ),
  heroNote: bi(
    "Currently working on 3D EM neuron segmentation (NISB) at Tsinghua, alongside recent work on CAD drawing evaluation (CVPR ’27 sub.) and LLM code safety (ICSE ’27).",
    "目前在清华大学推进三维电镜神经元分割（NISB）研究，近期工作涵盖基于工程图的 CAD 评测（CVPR 2027 在投）与大语言模型代码安全（ICSE 2027 已录用）。",
  ),
  bio: bi(
    "I am an undergraduate studying mathematics and physics at the University of Electronic Science and Technology of China (UESTC), and a research intern in Ziyin Liu’s group at Tsinghua University. My research spans 3D CAD geometry evaluation (DrawScore), language model safety (CodeSpear), spiking neural networks (FALCON), and 3D EM neuron segmentation (NISB).",
    "我是路仕腾，电子科技大学英才实验学院数理基础科学专业本科生，目前在清华大学刘子寅课题组进行科研实习。我的研究围绕三维 CAD 几何评测（DrawScore）、大语言模型安全（CodeSpear）、脉冲神经网络（FALCON）以及三维电镜神经元分割（NISB）展开。",
  ),
  interests: [
    bi("3D & CAD evaluation", "三维与 CAD 几何评测"),
    bi("Language model safety", "大语言模型安全"),
    bi("Connectomics & neuron segmentation", "连接组与神经元分割"),
    bi("Efficient neural networks", "高效神经网络"),
  ],
  education: {
    period: "2024 — 2028",
    school: bi(
      "University of Electronic Science and Technology of China",
      "电子科技大学",
    ),
    detail: bi(
      "Yingcai Honors College · Mathematics and Physics",
      "英才实验学院（荣誉学院）· 数理基础科学",
    ),
    note: bi(
      "Chengdian Honors Program · Expected graduation: June 2028",
      "“成电英才计划”拔尖创新人才实验班 · 预计 2028 年 6 月毕业",
    ),
  },
  internship: {
    period: bi("Current", "目前"),
    title: bi("Research Intern · Tsinghua University", "科研实习 · 清华大学"),
    group: bi("Ziyin Liu’s Research Group", "刘子寅课题组"),
    note: bi(
      "Working on 3D EM neuron segmentation benchmarking (NISB), split-error diagnosis, and inference-time graph bridging.",
      "参与三维电镜神经元分割基准（NISB）研究，聚焦断口分裂误差诊断与推理时图桥接优化。",
    ),
  },
  awards: [
    {
      year: "2025",
      title: bi(
        "Outstanding Student Scholarship · Second Class",
        "优秀学生奖学金 · 二等",
      ),
      org: bi("UESTC", "电子科技大学"),
    },
    {
      year: "2025",
      title: bi(
        "23rd ACM Programming Contest · Second Prize",
        "第二十三届 ACM 程序设计竞赛 · 二等奖",
      ),
      org: bi("UESTC", "电子科技大学"),
    },
    {
      year: "2025",
      title: bi(
        "Provincial First Prize · National Third Prize",
        "省级一等奖 · 国家级三等奖",
      ),
      org: bi("Lanqiao Cup", "蓝桥杯"),
    },
  ],
  skills: ["Python", "C++", "PyTorch", "PyTorch Connectomics", "Linux", "Git", "LaTeX", "lmms-eval"],
};

export const news: NewsItem[] = [
  {
    date: "2026.11",
    kind: "submission",
    badge: bi("CVPR ’27 Sub.", "CVPR 2027 在投"),
    text: bi(
      "DrawScore (co-first author) submitted to CVPR 2027, with preprint on arXiv and open-source code released on GitHub.",
      "共同第一作者论文 DrawScore 已投稿至 CVPR 2027，arXiv 预印本与 GitHub 代码库同步开源。",
    ),
    href: "/research#drawscore",
  },
  {
    date: "2026.11",
    kind: "progress",
    badge: bi("NISB", "NISB 进展"),
    text: bi(
      "Completed controlled ablations comparing affinity gap-bridging vs. 3D EM linkers on NISB; advancing size-aware bridging.",
      "在 NISB 基准上完成纯亲和力断口桥接与 3D EM 续接器的严格消融，正推进按片段尺度权衡的续接方案。",
    ),
    href: "/projects#nisb",
  },
  {
    date: "2026.06",
    kind: "accepted",
    badge: bi("ICSE ’27", "ICSE 2027 录用"),
    text: bi(
      "Grammar-Constrained Decoding Can Jailbreak LLMs into Generating Malicious Code (co-first author) accepted to ICSE 2027.",
      "共同第一作者论文（语法约束解码越狱 LLM 代码安全研究）被 ICSE 2027 录用。",
    ),
    href: "/research#codespear",
  },
  {
    date: "2026",
    kind: "submission",
    badge: bi("TPAMI Sub.", "TPAMI 在投"),
    text: bi(
      "FALCON (second author), studying low-latency ANN-to-SNN conversion and multimodal evaluation, is under review at TPAMI.",
      "第二作者论文 FALCON（低时间步脉冲神经网络转换与多模态评测）投稿至 TPAMI 审稿中。",
    ),
    href: "/research#falcon",
  },
];

export const publications: Publication[] = [
  {
    id: "drawscore",
    year: "2026",
    title:
      "DrawScore: Evaluating Generated CAD Models against Engineering Drawings",
    tag: "CAD EVALUATION",
    tagLabel: bi("CAD Evaluation", "CAD 几何评测"),
    venue: bi("CVPR 2027 · Under review", "CVPR 2027 · 在投"),
    statusTone: "review",
    role: bi("Co-first author", "共同第一作者"),
    authors:
      "Haorui Chen, Shiteng Lu, Zhanyu Guo, Zaixi Li, Yunhe Ni, Yaosong Du, Yichen Xiang, Xiande Huang, Rui Huang",
    artKind: "cad",
    plateMarker: "PROJECTION / CURVES / VERIFIER",
    homeTitle: bi(
      "Evaluating CAD like an engineer.",
      "像工程师一样评估 CAD 几何。",
    ),
    homeLabel: "DrawScore · Three-View Engineering Drawings",
    homeSummary: bi(
      "Projects generated CAD models into three orthographic views with saturating curve penalties—exposing local defects volumetric metrics miss.",
      "将生成的 CAD 模型投影为含隐藏线的三视图并引入饱和曲线惩罚，精准捕捉体积指标容易忽视的局部制造缺陷。",
    ),
    abstract: bi(
      "Volumetric IoU, Chamfer Distance, and surface F-score often overlook small yet manufacturing-critical local errors such as a misplaced hole or a missing slot. We formalize 3D geometric metrics into a unified integral form to explain why local error weights decay rapidly with size, and introduce DrawScore—comparing three-view orthographic engineering drawings (visible and hidden lines) with a saturating curve penalty. DrawScore exposes structural failures hidden by conventional metrics and serves as both a reinforcement learning reward and a test-time verifier.",
      "体积 IoU、Chamfer 距离和表面 F-score 等传统 3D 指标往往难以惩罚体积占比极小却足以破坏可制造性的局部缺陷（如错位孔洞或缺失槽口）。我们将几何相似性指标统一至积分形式，揭示局部误差权重随尺度快速衰减的根源，并提出基于三视图工程投影（含可见线与隐藏线）与饱和曲线惩罚的 DrawScore。该指标既能暴露被传统指标掩盖的结构性错误，也可直接用作强化学习奖励与推理时验证器。",
    ),
    contribution: bi(
      "As co-first author, I analyzed the discrepancy between projected drawing-curve metrics and volumetric metrics, led benchmark research and experimental design, implemented evaluation pipelines, and maintain the open-source DrawScore codebase.",
      "作为共同第一作者，我参与分析工程图投影曲线指标与体积类指标的差异，负责基准调研、实验设计与评测流水线实现，并开源维护 DrawScore 代码库。",
    ),
    url: "https://arxiv.org/abs/2611.24681",
    codeUrl: "https://github.com/UESTC-Simon/DrawScore",
    bibtex: `@misc{chen2026drawscore,
  title = {DrawScore: Evaluating Generated CAD Models against Engineering Drawings},
  author = {Haorui Chen and Shiteng Lu and Zhanyu Guo and Zaixi Li and Yunhe Ni and Yaosong Du and Yichen Xiang and Xiande Huang and Rui Huang},
  year = {2026},
  eprint = {2611.24681},
  archivePrefix = {arXiv},
  url = {https://arxiv.org/abs/2611.24681}
}`,
  },
  {
    id: "codespear",
    year: "2026",
    title:
      "Grammar-Constrained Decoding Can Jailbreak LLMs into Generating Malicious Code",
    tag: "LLM SAFETY",
    tagLabel: bi("LLM Safety", "大语言模型安全"),
    venue: bi("ICSE 2027 · Accepted", "ICSE 2027 · 已录用"),
    statusTone: "accepted",
    role: bi("Co-first author", "共同第一作者"),
    authors: "Yitong Zhang, Shiteng Lu, Jia Li",
    artKind: "flow",
    plateMarker: "CODE / CONSTRAINT / SAFETY",
    homeTitle: bi(
      "The safety of constrained generation.",
      "约束生成的安全边界。",
    ),
    homeLabel: "Grammar-Constrained Decoding",
    homeSummary: bi(
      "Investigates how grammar-constrained decoding bypasses safety alignment in LLMs across open-weight models and closed APIs.",
      "系统研究语法约束解码如何影响大语言模型的安全对齐边界，并在开源模型与闭源 API 上开展全面评测。",
    ),
    abstract: bi(
      "An investigation of how grammar-constrained decoding interacts with safety alignment in large language models, with systematic evaluations across open models and closed APIs.",
      "研究语法约束解码对大语言模型安全对齐的影响，并在开源模型与闭源 API 上开展系统评测。",
    ),
    contribution: bi(
      "I developed the experimental code and evaluation pipeline, analyzed results, produced figures, and contributed to the paper.",
      "我负责实验代码与评测流水线开发、实验数据和图表分析，并参与论文写作。",
    ),
    url: "https://arxiv.org/abs/2606.11817",
    bibtex: `@misc{zhang2026grammarconstrained,
  title = {Grammar-Constrained Decoding Can Jailbreak LLMs into Generating Malicious Code},
  author = {Yitong Zhang and Shiteng Lu and Jia Li},
  year = {2026},
  eprint = {2606.11817},
  archivePrefix = {arXiv},
  url = {https://arxiv.org/abs/2606.11817}
}`,
  },
  {
    id: "falcon",
    year: "2026",
    title:
      "FALCON: Fast and Low-latency Conversion for Spiking Neural Networks",
    tag: "EFFICIENT AI",
    tagLabel: bi("Efficient AI", "高效神经网络"),
    venue: bi("TPAMI · Under review", "TPAMI · 在投"),
    statusTone: "review",
    role: bi("Second author", "第二作者"),
    authors: "",
    artKind: "network",
    plateMarker: "SPIKES / EFFICIENCY / VISION",
    homeTitle: bi("Efficient, spiking intelligence.", "高效的脉冲智能。"),
    homeLabel: "FALCON · ANN-to-SNN",
    homeSummary: bi(
      "Studies ANN-to-SNN conversion at low timesteps and extends systematic evaluation to vision-language benchmarks.",
      "研究低时间步条件下的 ANN-to-SNN 转换方法，并将系统评测拓展至视觉语言多模态任务。",
    ),
    abstract: bi(
      "Studying ANN-to-SNN conversion at low timesteps and extending evaluation to vision-language tasks.",
      "研究低时间步条件下的 ANN-to-SNN 转换，并将评测扩展至视觉语言任务。",
    ),
    contribution: bi(
      "I built a multimodal evaluation pipeline with lmms-eval and conducted part of the ablation studies.",
      "我基于 lmms-eval 搭建多模态评测流水线，并完成部分消融实验。",
    ),
    url: "",
    bibtex: "",
  },
];

export const projects: Project[] = [
  {
    id: "nisb",
    number: "01",
    stage: "active",
    title: bi("Tracing neural structure", "追踪神经结构"),
    subtitle: bi(
      "NISB · 3D Neuron Segmentation Benchmarking",
      "NISB · 三维神经元分割评测与优化",
    ),
    status: bi("Active · Tsinghua Internship", "进行中 · 清华科研实习"),
    kind: "neuron",
    tags: ["Connectomics", "PyTC", "Affinity Bridging", "3D EM", "Inference"],
    description: bi(
      "Reproducing, diagnosing, and improving 3D electron-microscopy neuron reconstruction on NISB, targeting non-touching split errors through inference-time graph bridging.",
      "围绕 NISB 三维电镜神经元分割基准开展复现、误差诊断与推理时后处理优化，重点攻克非接触断口造成的错误分裂问题。",
    ),
    details: bi(
      "I have reproduced the PyTorch Connectomics (PyTC) + GASP segmentation baseline under strict validation/test isolation, constructed full-volume non-touching gap-candidate pools, and conducted controlled ablations comparing pure affinity path-bridging against 3D EM-conditioned neural linkers. Current work focuses on size-aware cost-benefit gap bridging and fast CPU screening before scaling to cross-validated neural linkers and false-merge correction. Quantitative leaderboard numbers remain internal while experiments are ongoing.",
      "已在严格的验证集/测试集隔离协议下完成 PyTorch Connectomics (PyTC) + GASP 分割基线复现，构建全卷非面接触断口几何候选池，并完成纯亲和力路径桥接与 3D EM 神经续接器的控制变量消融。目前正推进按片段尺度权衡收益的纯 CPU 快检与断口续接方案，随后将视结果迭代分折续接器与错误合并修复。实验推进期间暂不在此公开具体刷榜数值。",
    ),
    milestones: [
      {
        phase: bi("Baseline & Isolation", "基线复现与隔离"),
        text: bi(
          "Reproduced PyTC + GASP GRN3 baseline and locked strict validation/test-set isolation protocols.",
          "完整复现 PyTC + GASP 分割基线，建立严格的测试集隔离与独立复算核验机制。",
        ),
      },
      {
        phase: bi("Gap Audit & Ablation", "断口审计与消融"),
        text: bi(
          "Built non-touching gap candidate pools and ran controlled ablations comparing pure affinity ranking against 3D EM neural linkers.",
          "构建非面接触断口候选池，完成纯亲和力桥接与 3D EM 神经续接器的严格消融，定位稀疏断口下的泛化瓶颈。",
        ),
      },
      {
        phase: bi("Next · Size-Aware Bridging", "当前推进 · 尺度感知续接"),
        text: bi(
          "Developing size-aware cost-benefit bridging and tabular/path scoring on CPU before cross-validated v2 linkers and false-merge repair.",
          "推进按片段体积权衡得失的纯 CPU 快检与表格/路径特征打分，为下一阶段分折续接器与误合并修复奠定基础。",
        ),
      },
    ],
  },
  {
    id: "cad",
    number: "02",
    stage: "graduated",
    title: bi("Geometry, measured", "几何与度量"),
    subtitle: bi(
      "DrawScore · CAD Geometry Evaluation",
      "DrawScore · CAD 几何评估",
    ),
    status: bi("Submitted · CVPR 2027", "已投稿 · CVPR 2027"),
    kind: "geometry",
    tags: ["CAD", "DrawScore", "Three-View Projection", "Benchmarking"],
    description: bi(
      "Graduated from an ongoing benchmark investigation to a co-first-author CVPR 2027 submission with an open-source codebase and arXiv preprint.",
      "已从前期基准探索推进为共同第一作者论文投稿至 CVPR 2027，并同步公开 arXiv 预印本与开源代码库。",
    ),
    details: bi(
      "Formalizes volumetric and surface CAD metrics in a unified integral form and introduces DrawScore, comparing visible and hidden lines across three orthographic projections with a saturating curve penalty.",
      "将体积与表面类 CAD 指标统一到积分形式分析局部误差衰减问题，提出基于三视图可见线与隐藏线投影及饱和曲线惩罚的 DrawScore，并验证其作为强化学习奖励与推理时验证器的效果。",
    ),
    links: [
      {
        label: bi("Read paper details", "查看论文详情"),
        href: "/research#drawscore",
      },
      {
        label: bi("arXiv Preprint", "arXiv 预印本"),
        href: "https://arxiv.org/abs/2611.24681",
        external: true,
      },
      {
        label: bi("GitHub Code", "GitHub 代码"),
        href: "https://github.com/UESTC-Simon/DrawScore",
        external: true,
      },
    ],
  },
  {
    id: "loops",
    number: "C1",
    stage: "conjecture",
    title: bi("Thinking in loops", "循环中的计算"),
    subtitle: bi(
      "Looped Transformers · Open Conjecture",
      "共享参数的循环 Transformer · 研究猜想",
    ),
    status: bi("Open Conjecture · Not actively pursued", "研究猜想 · 暂未投入"),
    kind: "loops",
    tags: ["Transformers", "Parameter Sharing", "LoRA", "Conjecture"],
    description: bi(
      "A conceptual conjecture on whether parameter-shared looped Transformers can trade depth for iterative computation and working memory.",
      "一项开放性研究猜想：共享参数的循环 Transformer 能否通过迭代计算换取更强的表达与记忆能力。",
    ),
    details: bi(
      "The guiding question asks whether lightweight per-iteration LoRA perturbations or structured block-order schedules can break iterative symmetry in weight-tied layers without growing model parameters. Kept here purely as a recorded conjecture—no active experimental investment is currently underway, and no empirical claims are made.",
      "核心猜想围绕“在权重共享的循环层中引入轻量逐轮 LoRA 扰动或调整 block 顺序，能否在不扩大主干参数规模的前提下打破迭代对称性”展开。此处仅作为研究猜想记录，目前并未进行实际投入，亦不作任何方法有效性的断言。",
    ),
  },
];
