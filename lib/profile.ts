export type Lang = "en" | "zh";

export type Bilingual = {
  en: string;
  zh: string;
};

export const bi = (en: string, zh: string): Bilingual => ({ en, zh });

export const profile = {
  name: "Shiteng Lu",
  nameZh: "路仕腾",
  initials: "SL",
  email: "simonlu0306@gmail.com",
  siteUrl: "https://uestc-simon.github.io",
  socialLinks: [{ label: "Google Scholar", url: "https://scholar.google.com/citations?user=jT3St9kAAAAJ&hl=zh-CN" }] as { label: string; url: string }[],
  updated: "2026-11-08",
  role: bi(
    "Undergraduate at UESTC · Research Intern at Tsinghua",
    "电子科技大学本科生 · 清华大学科研实习生",
  ),
  shortBio: bi(
    "Exploring reliable AI — and how intelligence learns, remembers, and adapts.",
    "探索可靠的人工智能，也好奇智能如何学习、记忆与适应。",
  ),
  bio: bi(
    "I am an undergraduate studying mathematics and physics at the University of Electronic Science and Technology of China (UESTC), and a research intern in Ziyin Liu’s group at Tsinghua University. My research experience spans language model safety, spiking neural networks, and multimodal evaluation. My recent work also explores CAD geometry evaluation and neuron segmentation.",
    "我是路仕腾，电子科技大学英才实验学院数理基础科学专业本科生，目前在清华大学刘子寅课题组进行科研实习。我的研究经历涉及大语言模型安全、脉冲神经网络与多模态评测，近期也在探索 CAD 几何评估和神经元分割。",
  ),
  interests: [
    bi("Language model safety", "大语言模型安全"),
    bi("Efficient neural networks", "高效神经网络"),
    bi("Learning & memory", "学习与记忆"),
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
  skills: ["Python", "C++", "PyTorch", "Linux", "Git", "LaTeX", "lmms-eval"],
};

export const publications = [
  {
    id: "codespear",
    year: "2026",
    title:
      "Grammar-Constrained Decoding Can Jailbreak LLMs into Generating Malicious Code",
    tag: "LLM SAFETY",
    venue: bi("ICSE 2027 · Accepted", "ICSE 2027 · 已录用"),
    role: bi("Co-first author", "共同第一作者"),
    authors: "Yitong Zhang, Shiteng Lu, Jia Li",
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
    venue: bi("Under review at TPAMI", "TPAMI 在投"),
    role: bi("Second author", "第二作者"),
    authors: "",
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

export const projects = [
  {
    id: "cad",
    number: "01",
    title: bi("Geometry, measured", "几何与度量"),
    subtitle: bi("CAD Geometry Evaluation", "CAD 几何评估"),
    status: bi("Ongoing", "进行中"),
    kind: "geometry" as const,
    tags: ["CAD", "DrawScore", "Benchmarking"],
    description: bi(
      "Exploring how to evaluate generated CAD geometry, from projected drawing curves to volumetric metrics.",
      "从工程图投影曲线到体积类指标，探索生成 CAD 几何的评估方法。",
    ),
    details: bi(
      "As a co-first author, I am investigating differences between DrawScore, based on projected drawing-curve distances, and volumetric metrics. Current work includes benchmark research, experimental design, and evaluation experiments.",
      "作为共同第一作者，我正在研究基于工程图投影曲线距离的 DrawScore 与体积类指标之间的差异，目前开展基准调研、实验设计及评测实验。",
    ),
  },
  {
    id: "nisb",
    number: "02",
    title: bi("Tracing neural structure", "追踪神经结构"),
    subtitle: bi(
      "NISB · Neuron Segmentation Benchmarking",
      "NISB · 神经元分割评测",
    ),
    status: bi("Ongoing", "进行中"),
    kind: "neuron" as const,
    tags: ["Neuron Segmentation", "PyTC", "Inference"],
    description: bi(
      "Reproducing and evaluating neuron segmentation methods, with a focus on inference-time optimization.",
      "围绕神经元分割开展复现与评测，并探索推理时优化方法。",
    ),
    details: bi(
      "I have reproduced the PyTorch Connectomics pipeline and am exploring inference-time optimization for neuron segmentation benchmarks. This work is ongoing; quantitative benchmark results are not yet reported here.",
      "已完成 PyTorch Connectomics 流水线的复现，目前探索面向神经元分割基准的推理时优化方法。项目仍在进行中，暂未在此报告量化基准结果。",
    ),
  },
  {
    id: "loops",
    number: "03",
    title: bi("Thinking in loops", "循环中的计算"),
    subtitle: bi("Looped Transformers", "共享参数的循环 Transformer"),
    status: bi("Exploratory · On hold", "探索阶段 · 暂停"),
    kind: "loops" as const,
    tags: ["Transformers", "Parameter Sharing", "LoRA"],
    description: bi(
      "Exploring the expressive and memory capabilities of parameter-shared looped Transformers.",
      "探索共享参数循环 Transformer 的表达与记忆能力。",
    ),
    details: bi(
      "Preliminary experiments examine per-iteration LoRA perturbations and changes in block order. The project is currently on hold, and no effectiveness claims are made from these early experiments.",
      "预实验考察逐轮 LoRA 扰动与 block 顺序变化。项目目前暂停，尚未据此形成方法有效性的结论。",
    ),
  },
];
