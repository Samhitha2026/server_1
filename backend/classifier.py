from transformers import pipeline
import logging

# Initialize multiple pipelines for deeper intelligence
try:
    # Zero-shot for Category
    category_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
    # Sentiment/Priority Analysis
    priority_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
except Exception as e:
    logging.error(f"Error loading transformer models: {e}")
    category_classifier = None
    priority_analyzer = None

DEPARTMENTS = ["Roads & Infrastructure", "Sanitation & Waste", "Public Lighting", "Parks & Recreation", "Water Supply", "Emergency Services"]

def analyze_complaint(text: str):
    """
    Advanced AI analysis: Detects department, priority, and sentiment.
    """
    if not category_classifier:
        return {"category": "Other", "priority": "Medium", "urgency_score": 0.5}
    
    # 1. Detect Department
    cat_result = category_classifier(text, DEPARTMENTS)
    top_dept = cat_result['labels'][0]
    
    # 2. Detect Priority/Urgency
    # We look for keywords and sentiment
    priority_result = priority_analyzer(text)[0]
    is_negative = priority_result['label'] == 'NEGATIVE'
    score = priority_result['score']
    
    # Logic for Priority
    priority = "Medium"
    if is_negative and score > 0.9:
        priority = "High"
    if "emergency" in text.lower() or "danger" in text.lower() or "broken" in text.lower():
        priority = "Critical"
    elif score < 0.6:
        priority = "Low"
        
    return {
        "category": top_dept,
        "priority": priority,
        "urgency_score": score,
        "confidence": cat_result['scores'][0]
    }
