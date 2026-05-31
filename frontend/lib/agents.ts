export const INDUSTRIES = {
  healthcare:{label:'Healthcare',icon:'🏥',color:'#00D4AA',description:'Medical AI agents for patient care',
    agents:[
      {id:'patient_intake',name:'Patient Intake',description:'Triage assessment and appointment scheduling',icon:'👤',tools:['collect_patient_info','check_appointment_slots'],example:'Patient John, 67 years old, severe chest pain. Needs urgent cardiology appointment.'},
      {id:'diagnosis_assistant',name:'Diagnosis Assistant',description:'Symptom analysis and diagnostic pathways',icon:'🔬',tools:['lookup_symptoms','order_diagnostic_tests'],example:'Patient has fever, severe headache and neck stiffness for 2 days. Diagnostic pathway?'},
      {id:'prescription_checker',name:'Prescription Checker',description:'Drug interaction and dosage safety',icon:'💊',tools:['check_drug_interactions','verify_dosage'],example:'Patient on warfarin 5mg. New: aspirin 100mg. Weight 72kg, age 67. Safe?'},
    ]},
  finance:{label:'Finance',icon:'💰',color:'#4285F4',description:'Financial AI agents for banking',
    agents:[
      {id:'fraud_detector',name:'Fraud Detector',description:'Real-time transaction fraud detection',icon:'🛡️',tools:['analyze_transaction','check_transaction_history'],example:'Transaction: $15,000 to Romania at 3AM. Account holder is a 25-year-old student.'},
      {id:'loan_processor',name:'Loan Processor',description:'Credit assessment and loan verification',icon:'📋',tools:['assess_creditworthiness','verify_documents'],example:'Credit score 720, income $85k, debt $12k. Requesting $200k home loan.'},
      {id:'portfolio_advisor',name:'Portfolio Advisor',description:'Investment analysis and market insights',icon:'📈',tools:['analyze_portfolio','get_market_insights'],example:'Portfolio: Apple, Tesla, Nvidia. Medium risk tolerance. Technology sector insights?'},
    ]},
  legal:{label:'Legal',icon:'⚖️',color:'#9C27B0',description:'Legal AI agents for compliance',
    agents:[
      {id:'contract_analyzer',name:'Contract Analyzer',description:'Contract clause extraction and risk ID',icon:'📄',tools:['extract_contract_clauses','identify_contract_risks'],example:'Analyze vendor contract. Extract termination and liability clauses.'},
      {id:'compliance_checker',name:'Compliance Checker',description:'Regulatory compliance assessment',icon:'✅',tools:['check_regulatory_compliance','generate_compliance_report'],example:'Check HIPAA compliance for our healthcare SaaS. Generate report for MedTech Corp.'},
      {id:'dispute_resolver',name:'Dispute Resolver',description:'Legal dispute analysis and resolution',icon:'🤝',tools:['analyze_dispute','search_precedents'],example:'Contract dispute: TechCorp vs VendorXYZ. $500k claim. Breach of SLA. California.'},
    ]},
  manufacturing:{label:'Manufacturing',icon:'🏭',color:'#FF9800',description:'Industrial AI agents for factories',
    agents:[
      {id:'quality_inspector',name:'Quality Inspector',description:'Product quality inspection and testing',icon:'🔍',tools:['inspect_product_quality','run_quality_tests'],example:'Batch B2026-447: 10,000 electronic components. Defect rate 0.8%. Run full test suite.'},
      {id:'supply_chain',name:'Supply Chain',description:'Inventory and delivery optimization',icon:'🚛',tools:['check_inventory_levels','optimize_supply_route'],example:'Check SKU-XR500 at Warehouse Chennai. Optimize route: 5000kg Mumbai to Delhi.'},
      {id:'maintenance_predictor',name:'Maintenance Predictor',description:'Predictive equipment failure detection',icon:'⚙️',tools:['predict_equipment_failure','schedule_maintenance'],example:'Machine M-447: Temp 92°C, vibration 0.9, runtime 5200h. Predict failure risk.'},
    ]},
  ecommerce:{label:'E-commerce',icon:'🛒',color:'#E91E63',description:'Retail AI agents for online shopping',
    agents:[
      {id:'product_recommender',name:'Product Recommender',description:'Personalized recommendations and discounts',icon:'🎯',tools:['get_personalized_recommendations','apply_discount'],example:'User U-4521 (Gold tier), budget ₹15k, electronics. Recommend with loyalty discount.'},
      {id:'order_manager',name:'Order Manager',description:'Order tracking, returns and refunds',icon:'📦',tools:['track_order','process_return'],example:'Track ORD-2026-88421. Also return 2 items from ORD-2026-88100, wrong size.'},
      {id:'customer_support',name:'Customer Support',description:'Issue resolution with customer history',icon:'💬',tools:['resolve_customer_issue','check_customer_history'],example:'Customer C-7821 charged twice for order. Check history and resolve billing issue.'},
    ]},
}
export type Industry = keyof typeof INDUSTRIES
export const getAllAgents = () => Object.entries(INDUSTRIES).flatMap(([industry,data])=>data.agents.map(a=>({...a,industry,industryLabel:data.label,industryColor:data.color})))
export const getAgentById = (id:string) => getAllAgents().find(a=>a.id===id)