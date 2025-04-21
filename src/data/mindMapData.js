// src/data/mindMapData.js - Updated with removed welcome text

// Export the mind map data
export const mindMapData = {
  nodes: [
    // Main category
    { 
      id: "main", 
      labelEn: "My Mind Map",
      labelTr: "Zihin Haritam",
      x: 500, 
      y: 100, 
      type: "main", 
      size: 75, 
      route: "/" 
    },
    
    // Skills/Programming group - purple/blue gradient
    { 
      id: "programming", 
      labelEn: "Python Programming",
      labelTr: "Python Programlama",
      x: 250, 
      y: 250, 
      type: "skills", 
      size: 40, 
      route: "/skills/programming" 
    },
    { 
      id: "ai", 
      labelEn: "AI Projects",
      labelTr: "Yapay Zeka Projeleri",
      x: 370, 
      y: 280, 
      type: "skills", 
      size: 35, 
      route: "/projects/ai" 
    },
    { 
      id: "neural", 
      labelEn: "Neural Networks",
      labelTr: "Sinir Ağları",
      x: 300, 
      y: 350, 
      type: "skills", 
      size: 38, 
      route: "/projects/neural-networks" 
    },
    
    // Personal interests - red/orange gradient
    { 
      id: "travel", 
      labelEn: "Travel",
      labelTr: "Seyahat",
      x: 200, 
      y: 450, 
      type: "interests", 
      size: 30, 
      route: "/interests/travel" 
    },
    { 
      id: "music", 
      labelEn: "Music",
      labelTr: "Müzik",
      x: 350, 
      y: 500, 
      type: "interests", 
      size: 28, 
      route: "/interests/music" 
    },
    
    // Education - blue/teal gradient
    { 
      id: "education", 
      labelEn: "Education",
      labelTr: "Eğitim",
      x: 450, 
      y: 400, 
      type: "education", 
      size: 35, 
      route: "/education" 
    },
    
    // Projects - blue/cyan gradient
    { 
      id: "projects", 
      labelEn: "Projects",
      labelTr: "Projeler",
      x: 500, 
      y: 550, 
      type: "projects", 
      size: 45, 
      route: "/projects" 
    },
  ],
  
  links: [
    // Connect main node to categories
    { source: "main", target: "programming", weight: 0.8 },
    { source: "main", target: "ai", weight: 0.7 },
    { source: "main", target: "neural", weight: 0.7 },
    { source: "main", target: "travel", weight: 0.6 },
    { source: "main", target: "education", weight: 0.5 },
    { source: "main", target: "projects", weight: 0.8 },
    
    // Connect skills nodes
    { source: "programming", target: "ai", weight: 0.9 },
    { source: "ai", target: "neural", weight: 0.9 },
    { source: "neural", target: "projects", weight: 0.7 },
    
    // Connect education nodes
    { source: "education", target: "programming", weight: 0.8 },
    { source: "education", target: "projects", weight: 0.6 },
    
    // Connect interests
    { source: "travel", target: "music", weight: 0.4 },
    
    // Cross-connections
    { source: "programming", target: "projects", weight: 0.7 },
    { source: "ai", target: "projects", weight: 0.8 },
    { source: "neural", target: "programming", weight: 0.7 },
  ]
};

// Content for each node in both languages
export const nodeContent = {
  main: {
    en: {
      title: "My Mind Map",
      description: `<p>Explore my skills, interests, and expertise. Click on any node to learn more about that topic.</p>
      <p class="mt-4">This visualization shows connections between different areas of my life and work.</p>
      <p class="mt-4">Hover over nodes to see connections:</p>
      <ul class="list-disc pl-6 mt-2 space-y-2">
        <li><span class="text-purple-400 font-semibold">Purple/Blue</span>: Technical skills</li>
        <li><span class="text-red-400 font-semibold">Red/Orange</span>: Personal interests</li>
        <li><span class="text-teal-400 font-semibold">Teal/Blue</span>: Education</li>
        <li><span class="text-blue-400 font-semibold">Blue/Cyan</span>: Projects</li>
      </ul>`
    },
    tr: {
      title: "Zihin Haritam",
      description: `<p>Becerilerimi, ilgi alanlarımı ve uzmanlıklarımı keşfedin. Daha fazla bilgi edinmek için herhangi bir düğüme tıklayın.</p>
      <p class="mt-4">Bu görselleştirme, hayatımın ve çalışmalarımın farklı alanları arasındaki bağlantıları gösteriyor.</p>
      <p class="mt-4">Bağlantıları görmek için düğümlerin üzerine gelin:</p>
      <ul class="list-disc pl-6 mt-2 space-y-2">
        <li><span class="text-purple-400 font-semibold">Mor/Mavi</span>: Teknik beceriler</li>
        <li><span class="text-red-400 font-semibold">Kırmızı/Turuncu</span>: Kişisel ilgi alanları</li>
        <li><span class="text-teal-400 font-semibold">Turkuaz/Mavi</span>: Eğitim</li>
        <li><span class="text-blue-400 font-semibold">Mavi/Camgöbeği</span>: Projeler</li>
      </ul>`
    }
  },
  
  programming: {
    en: {
      title: "Python Programming",
      description: `<p>I've been programming in Python for over 5 years, developing expertise in various libraries and frameworks including:</p>
      <ul class="list-disc pl-6 mt-4">
        <li>Data analysis with Pandas, NumPy, and SciPy</li>
        <li>Machine learning with TensorFlow, PyTorch and scikit-learn</li>
        <li>Web development with Django and Flask</li>
        <li>Automation and scripting for various tasks</li>
      </ul>
      <p class="mt-4">My Python expertise has been applied across multiple domains, from data science to web development.</p>`
    },
    tr: {
      title: "Python Programlama",
      description: `<p>5 yılı aşkın bir süredir Python ile programlama yapıyorum ve çeşitli kütüphaneler ve çerçevelerde uzmanlık geliştirdim:</p>
      <ul class="list-disc pl-6 mt-4">
        <li>Pandas, NumPy ve SciPy ile veri analizi</li>
        <li>TensorFlow, PyTorch ve scikit-learn ile makine öğrenimi</li>
        <li>Django ve Flask ile web geliştirme</li>
        <li>Çeşitli görevler için otomasyon ve komut dosyası oluşturma</li>
      </ul>
      <p class="mt-4">Python uzmanlığım, veri biliminden web geliştirmeye kadar birçok alanda uygulanmıştır.</p>`
    }
  },
  
  ai: {
    en: {
      title: "AI Projects",
      description: `<p>I've worked on a variety of AI projects, exploring different aspects of artificial intelligence and machine learning:</p>
      <ul class="list-disc pl-6 mt-4">
        <li><strong>Computer Vision</strong>: Object detection and tracking systems</li>
        <li><strong>Natural Language Processing</strong>: Text analysis and sentiment detection</li>
        <li><strong>Reinforcement Learning</strong>: Training agents to solve complex tasks</li>
        <li><strong>Neural Networks</strong>: Custom architectures for specialized problems</li>
      </ul>
      <p class="mt-4">These projects have given me a deep understanding of AI concepts and practical implementation experience.</p>`
    },
    tr: {
      title: "Yapay Zeka Projeleri",
      description: `<p>Yapay zekanın ve makine öğreniminin farklı yönlerini keşfeden çeşitli yapay zeka projeleri üzerinde çalıştım:</p>
      <ul class="list-disc pl-6 mt-4">
        <li><strong>Bilgisayarlı Görü</strong>: Nesne algılama ve izleme sistemleri</li>
        <li><strong>Doğal Dil İşleme</strong>: Metin analizi ve duygu tespiti</li>
        <li><strong>Pekiştirmeli Öğrenme</strong>: Karmaşık görevleri çözmek için ajanları eğitme</li>
        <li><strong>Sinir Ağları</strong>: Özel problemler için özelleştirilmiş mimariler</li>
      </ul>
      <p class="mt-4">Bu projeler, yapay zeka kavramları ve pratik uygulama deneyimi konusunda derin bir anlayış kazanmamı sağladı.</p>`
    }
  },
  
  neural: {
    en: {
      title: "Neural Networks",
      description: `<p>Neural networks have been a primary focus of my technical work, with expertise in:</p>
      <ul class="list-disc pl-6 mt-4">
        <li>Convolutional Neural Networks (CNNs) for image processing</li>
        <li>Recurrent Neural Networks (RNNs) and LSTMs for sequence data</li>
        <li>Transformer architectures for NLP and beyond</li>
        <li>Custom network architectures for specialized applications</li>
        <li>Network visualization and explainability</li>
      </ul>
      <p class="mt-4">I've implemented neural networks for a variety of applications, from medical image analysis to time series prediction.</p>`
    },
    tr: {
      title: "Sinir Ağları",
      description: `<p>Sinir ağları, teknik çalışmalarımın ana odak noktası olmuştur ve şu alanlarda uzmanlığım vardır:</p>
      <ul class="list-disc pl-6 mt-4">
        <li>Görüntü işleme için Evrişimli Sinir Ağları (CNN'ler)</li>
        <li>Sıralı veriler için Tekrarlayan Sinir Ağları (RNN'ler) ve LSTM'ler</li>
        <li>NLP ve ötesi için Transformer mimarileri</li>
        <li>Özel uygulamalar için özelleştirilmiş ağ mimarileri</li>
        <li>Ağ görselleştirme ve açıklanabilirlik</li>
      </ul>
      <p class="mt-4">Tıbbi görüntü analizinden zaman serisi tahminine kadar çeşitli uygulamalar için sinir ağları geliştirdim ve uyguladım.</p>`
    }
  },
  
  travel: {
    en: {
      title: "Travel",
      description: `<p>Exploring new places and experiencing different cultures is one of my greatest passions. Some highlights include:</p>
      <ul class="list-disc pl-6 mt-4">
        <li>Backpacking through Southeast Asia for 3 months</li>
        <li>Road trip across the western United States</li>
        <li>Living in Amsterdam for 2 years</li>
        <li>Exploring ancient ruins in Peru and Mexico</li>
      </ul>
      <p class="mt-4">Travel has broadened my perspective and influenced my approach to problem-solving and creativity.</p>`
    },
    tr: {
      title: "Seyahat",
      description: `<p>Yeni yerler keşfetmek ve farklı kültürleri deneyimlemek en büyük tutkularımdan biridir. Bazı öne çıkan deneyimlerim:</p>
      <ul class="list-disc pl-6 mt-4">
        <li>Güneydoğu Asya'da 3 ay sırt çantalı gezme</li>
        <li>Batı Amerika Birleşik Devletleri boyunca yol gezisi</li>
        <li>Amsterdam'da 2 yıl yaşama</li>
        <li>Peru ve Meksika'daki antik kalıntıları keşfetme</li>
      </ul>
      <p class="mt-4">Seyahat, bakış açımı genişletti ve problem çözme ve yaratıcılık yaklaşımımı etkiledi.</p>`
    }
  },
  
  music: {
    en: {
      title: "Music",
      description: `<p>Music is an essential part of my life, both as a listener and creator:</p>
      <ul class="list-disc pl-6 mt-4">
        <li>Piano player for over 10 years</li>
        <li>Electronic music production using Ableton Live</li>
        <li>Jazz and classical music enthusiast</li>
        <li>Experience with music visualization projects</li>
      </ul>
      <p class="mt-4">I find many parallels between music composition and software development - both involve creating structured systems that convey meaning and emotion.</p>`
    },
    tr: {
      title: "Müzik",
      description: `<p>Müzik, hem dinleyici hem de yaratıcı olarak hayatımın önemli bir parçasıdır:</p>
      <ul class="list-disc pl-6 mt-4">
        <li>10 yılı aşkın süredir piyano çalıyorum</li>
        <li>Ableton Live kullanarak elektronik müzik prodüksiyonu</li>
        <li>Caz ve klasik müzik tutkunuyum</li>
        <li>Müzik görselleştirme projeleri deneyimim var</li>
      </ul>
      <p class="mt-4">Müzik kompozisyonu ile yazılım geliştirme arasında birçok benzerlik buluyorum - her ikisi de anlam ve duygu ileten yapılandırılmış sistemler oluşturmayı içerir.</p>`
    }
  },
  
  education: {
    en: {
      title: "Education",
      description: `<p>My educational background has shaped my approach to problem-solving and innovation:</p>
      <ul class="list-disc pl-6 mt-4">
        <li>Master's Degree in Computer Science with specialization in AI</li>
        <li>Bachelor's Degree in Software Engineering</li>
        <li>Continuous learning through online courses and certifications</li>
        <li>Participation in hackathons and coding competitions</li>
      </ul>
      <p class="mt-4">I believe in lifelong learning and regularly update my skills through courses, technical reading, and hands-on projects.</p>`
    },
    tr: {
      title: "Eğitim",
      description: `<p>Eğitim geçmişim, problem çözme ve yenilik yaklaşımımı şekillendirmiştir:</p>
      <ul class="list-disc pl-6 mt-4">
        <li>Yapay Zeka uzmanlığıyla Bilgisayar Bilimi Yüksek Lisansı</li>
        <li>Yazılım Mühendisliği Lisans Derecesi</li>
        <li>Çevrimiçi kurslar ve sertifikalar aracılığıyla sürekli öğrenme</li>
        <li>Hackathon ve kodlama yarışmalarına katılım</li>
      </ul>
      <p class="mt-4">Yaşam boyu öğrenmeye inanıyorum ve becerilerimi düzenli olarak kurslar, teknik okuma ve uygulamalı projeler aracılığıyla güncelliyorum.</p>`
    }
  },
  
  projects: {
    en: {
      title: "Projects",
      description: `<p>Some of my most significant projects include:</p>
      <ul class="list-disc pl-6 mt-4">
        <li><strong>Neural Network Visualization Platform</strong>: Interactive tool for visualizing and explaining neural network behavior</li>
        <li><strong>Time Series Forecasting System</strong>: Predictive analytics tool for business data</li>
        <li><strong>Sentiment Analysis Dashboard</strong>: Real-time analysis of social media sentiment</li>
        <li><strong>Educational AR Application</strong>: Augmented reality app for teaching complex concepts</li>
      </ul>
      <p class="mt-4">These projects demonstrate my ability to combine technical skills with creative problem-solving to deliver impactful solutions.</p>`
    },
    tr: {
      title: "Projeler",
      description: `<p>En önemli projelerimden bazıları şunlardır:</p>
      <ul class="list-disc pl-6 mt-4">
        <li><strong>Sinir Ağı Görselleştirme Platformu</strong>: Sinir ağı davranışını görselleştirmek ve açıklamak için interaktif araç</li>
        <li><strong>Zaman Serisi Tahmin Sistemi</strong>: İş verileri için öngörücü analiz aracı</li>
        <li><strong>Duygu Analizi Gösterge Paneli</strong>: Sosyal medya duygularının gerçek zamanlı analizi</li>
        <li><strong>Eğitim AR Uygulaması</strong>: Karmaşık kavramları öğretmek için artırılmış gerçeklik uygulaması</li>
      </ul>
      <p class="mt-4">Bu projeler, etkileyici çözümler sunmak için teknik becerileri yaratıcı problem çözmeyle birleştirme yeteneğimi gösteriyor.</p>`
    }
  }
};