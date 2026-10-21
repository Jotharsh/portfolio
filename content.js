// Edit this file to personalise your portfolio. Everything on the page comes from here.
// Empty values ("" or []) are simply hidden on the page.
window.PORTFOLIO = {
  name: "Jotharsh D",
  title: "IoT & Embedded Systems Developer",
  tagline: "Building end-to-end IoT prototypes: from sensors and devices to cloud dashboards and automation.",
  bio: [
    "B.Tech Computer Science Engineering (IoT) student with hands-on experience in IoT, embedded systems, Industrial IoT, cloud-connected applications and computer vision prototypes. I build end-to-end systems covering sensor acquisition, device communication, data processing, cloud integration, dashboards and automation.",
    "I'm looking for opportunities in Embedded Systems, IoT, Industrial IoT, Edge Computing or IoT Software Engineering. I've also solved 60+ problems on LeetCode."
  ],
  location: "Bengaluru, India",
  availability: "Open to IoT & embedded roles",
  coords: "12.9716° N · 77.5946° E",
  marquee: ["ESP32", "MQTT", "Node-RED", "AWS IoT Core", "OpenCV", "ThingsBoard", "CoAP", "Arduino", "Raspberry Pi", "Python", "React", "Edge Computing"],
  stats: [
    { value: "10", label: "Projects" },
    { value: "2", label: "Internships" },
    { value: "60+", label: "LeetCode solved" }
  ],
  interests: ["Embedded Systems", "IoT Engineering", "Industrial IoT", "Edge Computing", "Cloud IoT", "Sensor Networks", "Automation", "Computer Vision", "IoT Data Analytics"],
  skills: {
    Programming: ["Python", "C/C++", "Java", "JavaScript", "HTML", "CSS", "SQL"],
    "Embedded & IoT": ["ESP32", "ESP32-CAM", "ESP8266", "Arduino Uno", "NodeMCU", "Sensors", "Actuators", "GPIO", "Serial Communication"],
    "IoT Protocols & Platforms": ["MQTT", "CoAP", "HTTP", "REST APIs", "Node-RED", "ThingsBoard", "ThingSpeak"],
    "Cloud & DevOps": ["AWS IoT Core", "AWS S3", "AWS CloudWatch", "AWS IAM", "AWS Cloud9", "Google Cloud Platform"],
    "Computer Vision & AI": ["OpenCV", "OCR", "Pytesseract", "Machine Learning", "Q-Learning", "Deep Reinforcement Learning", "Google Cloud Gen AI SDK"],
    "Databases & Data": ["MySQL", "SQLite", "Google Sheets", "Pandas", "CSV", "Data Logging"],
    "Web & Frameworks": ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "Django", "Flask"],
    "Dev Tools": ["VS Code", "Git/GitHub", "Google Colab", "Jupyter", "Arduino IDE", "Tinkercad", "Wokwi", "Cisco Packet Tracer", "XAMPP", "macOS/Linux"]
  },
  projects: [
    {
      name: "Smart Vending Machine Analytics",
      description: "IoT vending machine monitoring prototype that captures product dispensing and machine state using a load cell, IR sensor and reed switch, feeding a cloud architecture for inventory and operational analytics.",
      tech: ["ESP32/Arduino", "HX711", "Load Cell", "AWS"],
      github: "",
      live: ""
    },
    {
      name: "Vehicle Number Plate Detection & Parking Analytics",
      description: "Detects vehicles and reads number plates with OpenCV and Pytesseract OCR, logging plate, timestamps and entry/exit data to Google Sheets to analyse parking occupancy and peak periods.",
      tech: ["ESP32-CAM", "Raspberry Pi", "Python", "OpenCV", "Pytesseract"],
      github: "",
      live: ""
    },
    {
      name: "HarvestGuard: Cold Chain Monitoring Platform",
      description: "Web dashboard concept for IoT-enabled cold-chain management with real-time visibility, alerts and centralized administration for food and pharmaceutical storage.",
      tech: ["React", "Vite", "Tailwind CSS", "IoT"],
      github: "",
      live: ""
    },
    {
      name: "Smart Irrigation System",
      description: "Automated irrigation using an ESP8266 and soil moisture sensor, switching a relay by soil conditions, with Node-RED monitoring and CoAP resources (/soil, /irrigation).",
      tech: ["ESP8266", "Node-RED", "CoAP", "Relay"],
      github: "",
      live: ""
    },
    {
      name: "Gas Leakage Monitoring & Analytics",
      description: "MQ-2 gas monitoring with threshold-based detection, a live Node-RED dashboard and MySQL storage for historical analysis.",
      tech: ["MQ-2", "Arduino/ESP", "Node-RED", "MySQL"],
      github: "",
      live: ""
    },
    {
      name: "Water Level Monitoring System",
      description: "Estimates tank water level from ultrasonic distance readings, with buzzer alerts at set thresholds and an ESP8266 layer for remote monitoring.",
      tech: ["ESP8266", "Arduino", "Ultrasonic Sensor"],
      github: "",
      live: ""
    },
    {
      name: "AI-Based Trip Planner",
      description: "Trip planning web app that uses the Gemini API to generate itineraries.",
      tech: ["Django", "Gemini API", "Python"],
      github: "",
      live: ""
    },
    {
      name: "AWS Clickstream Data Analytics Pipeline",
      description: "Cloud pipeline for collecting, storing and analysing clickstream and log data, queried with CloudWatch Logs Insights.",
      tech: ["AWS S3", "CloudWatch", "IAM", "Cloud9"],
      github: "",
      live: ""
    },
    {
      name: "Advanced Route Optimization using RL",
      description: "Route optimization notebook exploring optimal route selection in a simulated environment with Q-Learning and Deep Reinforcement Learning.",
      tech: ["Python", "Google Colab", "Q-Learning", "Deep RL"],
      github: "",
      live: ""
    },
    {
      name: "Zero-Downtime VM Migration Simulation",
      description: "Simulated a high-availability virtualized network to study redundancy and live VM migration workflows.",
      tech: ["Cisco Packet Tracer", "Virtualization"],
      github: "",
      live: ""
    }
  ],
  experience: [
    {
      role: "IoT / Industrial IoT Intern",
      org: "SBSS Solutions",
      dates: "",
      details: "Hands-on exposure to IoT connectivity, Industrial IoT architectures, device communication and implementation workflows; integrating sensors and edge devices with software platforms for monitoring and automation."
    },
    {
      role: "Frontend Development Intern",
      org: "Nuetrex.io",
      dates: "One-month internship",
      details: "Built and structured responsive web interfaces with HTML and CSS, and learned frontend development and website implementation workflows."
    },
    {
      role: "B.Tech, Computer Science Engineering (IoT)",
      org: "CHRIST (Deemed to be University), Bengaluru",
      dates: "Expected 2027",
      details: "Coursework: Internet of Things, Advanced IoT, Cloud Computing, Data Center Virtualization, DBMS, Digital Marketing, Intellectual Property Rights."
    }
  ],
  certifications: [
    "Exploring IoT with Cisco Packet Tracer · Cisco Networking Academy (2024)",
    "Exploring Networking with Cisco Packet Tracer · Cisco Networking Academy (2024)",
    "Introduction to Cybersecurity · Cisco Networking Academy (2023)"
  ],
  links: {
    email: "jotharsh2004@gmail.com",
    phoneB64: "KzkxIDYzODE2IDQ1MTgy", // base64 of the number; only decoded when a visitor clicks "Show phone number"
    github: "https://github.com/Jotharsh",
    linkedin: "https://www.linkedin.com/in/jotharsh",
    resume: "" // e.g. "resume.pdf" after placing the file in this folder
  }
};
