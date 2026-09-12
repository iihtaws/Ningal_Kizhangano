import io
import math
import os
import sys
import logging
from typing import Dict, Any, List

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("potato-ml-service")

app = FastAPI(
    title="Potato-O-Meter ML Service",
    description="Precision CLIP Neural Network service to evaluate image similarity to a potato.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model state
clip_model = None
clip_processor = None
model_loaded = False
model_load_error = None

def load_clip_model():
    global clip_model, clip_processor, model_loaded, model_load_error
    if model_loaded:
        return True
    try:
        logger.info("Loading pretrained OpenAI CLIP model (openai/clip-vit-base-patch32)...")
        from transformers import CLIPProcessor, CLIPModel
        clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        clip_model.eval()
        model_loaded = True
        logger.info("CLIP model successfully loaded into memory!")
        return True
    except Exception as e:
        model_load_error = str(e)
        logger.warning(f"Could not load HuggingFace CLIP model: {e}. Falling back to Calibrated Visual Analyzer.")
        return False

@app.on_event("startup")
def startup_event():
    try:
        load_clip_model()
    except Exception as e:
        logger.warning(f"Startup CLIP load warning: {e}")

# Zero-Shot Candidate Classes & Weights
CANDIDATE_CLASSES = [
    {
        "id": "raw_potato",
        "label": "Raw Spud Potato",
        "templates": [
            "a photo of a raw brown potato",
            "a photo of an idaho russet potato",
            "a photo of a freshly dug spud potato with dirt",
            "a photo of a brown potato vegetable"
        ],
        "weight": 1.0 # 100% potato
    },
    {
        "id": "cooked_potato",
        "label": "Cooked Potato / French Fries",
        "templates": [
            "a photo of baked potato or french fries",
            "a photo of potato chips or mashed potatoes",
            "a photo of crispy golden potato snacks"
        ],
        "weight": 0.75 # 75% potato derivative
    },
    {
        "id": "root_vegetable",
        "label": "Root Vegetable",
        "templates": [
            "a photo of a sweet potato or yam",
            "a photo of a turnip or beet root"
        ],
        "weight": 0.50 # 50% root family relative
    },
    {
        "id": "fruit",
        "label": "Non-Potato Fruit",
        "templates": [
            "a photo of a red apple, orange, or banana fruit",
            "a photo of a tomato or strawberry"
        ],
        "weight": 0.05
    },
    {
        "id": "animal",
        "label": "Pet or Animal",
        "templates": [
            "a photo of a cat, dog, or animal pet",
            "a photo of a bird or furry animal"
        ],
        "weight": 0.0
    },
    {
        "id": "human",
        "label": "Person or Face",
        "templates": [
            "a photo of a human person or face",
            "a portrait photo of a person"
        ],
        "weight": 0.0
    },
    {
        "id": "object",
        "label": "Vehicle or Device",
        "templates": [
            "a photo of a car, vehicle, or motorcycle",
            "a photo of a computer, smartphone, or electronic gadget",
            "a photo of furniture, building, or room"
        ],
        "weight": 0.0
    }
]

def generate_potato_verdict(score: float, top_class: str) -> Dict[str, Any]:
    score_val = round(score, 1)
    
    if score_val >= 85:
        title = "Certified Golden Russet 🥔"
        badge = "PURE SPUD"
        desc = "Flawless spud affinity! High organic brown texture and quintessential potato geometry."
    elif score_val >= 65:
        title = "High Potato Energy 🥔"
        badge = "SUPER STARCHY"
        desc = "Strong visual match to potato derivatives or rich earthy spud visual features."
    elif score_val >= 45:
        title = "Half-Baked Spud 🥔"
        badge = "MODERATE STARCH"
        desc = "Shares root vegetable elements or color tones, but has distinct non-potato features."
    elif score_val >= 25:
        title = "Low Starch Potential 🥔"
        badge = "SLIGHTLY ROOTY"
        desc = "Minor resemblance to organic items. Definitely needs more butter, salt, and chives."
    else:
        title = "0% Potato - Pure Imposter! 🚫"
        badge = "NOT A SPUD"
        desc = "Zero potato visual traits detected. Do not attempt to bake or fry this object!"

    return {
        "title": title,
        "badge": badge,
        "desc": desc
    }

def analyze_with_clip(img: Image.Image) -> Dict[str, Any]:
    import torch
    import numpy as np

    all_text_prompts = []
    class_indices = []

    for idx, cls in enumerate(CANDIDATE_CLASSES):
        for template in cls["templates"]:
            all_text_prompts.append(template)
            class_indices.append(idx)

    # Process through Hugging Face CLIP
    inputs = clip_processor(text=all_text_prompts, images=img, return_tensors="pt", padding=True)

    with torch.no_grad():
        outputs = clip_model(**inputs)
        logits_per_image = outputs.logits_per_image # shape (1, num_prompts)
        probs = logits_per_image.softmax(dim=-1)[0].cpu().numpy()

    # Aggregate probabilities by candidate class
    class_probs = [0.0] * len(CANDIDATE_CLASSES)
    for p_idx, prob in enumerate(probs):
        c_idx = class_indices[p_idx]
        class_probs[c_idx] += float(prob)

    # Weighted Potato Score calculation
    weighted_score = 0.0
    for idx, cls in enumerate(CANDIDATE_CLASSES):
        weighted_score += class_probs[idx] * cls["weight"]

    # Scale final score percentage (0 - 100%)
    final_score = float(weighted_score * 100.0)
    
    raw_spud_conf = float(class_probs[0] * 100.0)
    cooked_conf = float(class_probs[1] * 100.0)

    # Calculate Visual Attributes (Earthiness, Texture Match, Starch Index, Roundness)
    width, height = img.size
    aspect_ratio = min(width, height) / max(width, height)
    roundness_score = round(min(100.0, aspect_ratio * 108.0), 1)

    earthiness = round(min(100.0, max(5.0, raw_spud_conf * 0.95 + final_score * 0.1)), 1)
    texture_match = round(min(100.0, max(5.0, final_score * 0.9 + (10.0 if final_score > 30 else 0))), 1)
    starch_index = round(min(100.0, max(5.0, (raw_spud_conf + cooked_conf) * 0.85)), 1)

    top_class_idx = int(np.argmax(class_probs))
    top_class_name = CANDIDATE_CLASSES[top_class_idx]["label"]

    verdict = generate_potato_verdict(final_score, top_class_name)

    top_matches = []
    for idx, cls in enumerate(CANDIDATE_CLASSES[:4]):
        top_matches.append({
            "label": cls["label"],
            "confidence": round(float(class_probs[idx] * 100.0), 1)
        })

    return {
        "similarity_score": round(final_score, 1),
        "rating_title": verdict["title"],
        "badge": verdict["badge"],
        "description": verdict["desc"],
        "engine": "OpenAI CLIP Zero-Shot (ViT-B/32)",
        "breakdown": {
            "earthiness": earthiness,
            "texture_match": texture_match,
            "starch_index": starch_index,
            "roundness_factor": roundness_score
        },
        "top_matches": top_matches
    }

def analyze_with_heuristic(img: Image.Image) -> Dict[str, Any]:
    """Precision visual heuristic analyzer fallback."""
    img_rgb = img.convert("RGB")
    width, height = img_rgb.size
    
    small_img = img_rgb.resize((100, 100))
    pixels = list(small_img.getdata())
    
    potato_brown_count = 0
    golden_fry_count = 0
    total_pixels = len(pixels)
    
    for r, g, b in pixels:
        # Brown spud color range
        is_brown = (r > g) and (g > b) and (r > 45) and (r < 210) and ((r - b) > 15)
        # Golden baked/fries color range
        is_golden = (r > 160) and (g > 110) and (b < 90) and ((r - g) < 70)
        
        if is_brown:
            potato_brown_count += 1
        elif is_golden:
            golden_fry_count += 1

    brown_pct = (potato_brown_count / total_pixels) * 100.0
    golden_pct = (golden_fry_count / total_pixels) * 100.0
    
    aspect_ratio = min(width, height) / max(width, height)
    aspect_score = aspect_ratio * 100.0
    
    # Combined heuristic score
    spud_pct = (brown_pct * 0.7) + (golden_pct * 0.5)
    final_score = min(96.0, max(2.0, (spud_pct * 0.75) + (aspect_score * 0.25)))
    
    verdict = generate_potato_verdict(final_score, "Visual Heuristic")
    
    return {
        "similarity_score": round(final_score, 1),
        "rating_title": verdict["title"],
        "badge": verdict["badge"],
        "description": verdict["desc"],
        "engine": "Calibrated Visual Heuristic Engine",
        "breakdown": {
            "earthiness": round(min(99.0, max(5.0, brown_pct * 1.1)), 1),
            "texture_match": round(min(99.0, max(5.0, final_score * 0.9)), 1),
            "starch_index": round(min(99.0, max(5.0, (brown_pct + golden_pct) * 0.95)), 1),
            "roundness_factor": round(aspect_score, 1)
        },
        "top_matches": [
            {"label": "Raw Brown Tones", "confidence": round(brown_pct, 1)},
            {"label": "Golden Starch", "confidence": round(golden_pct, 1)},
            {"label": "Oval Geometry", "confidence": round(aspect_score, 1)}
        ]
    }

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "Potato-O-Meter ML Engine",
        "clip_loaded": model_loaded,
        "model_name": "openai/clip-vit-base-patch32" if model_loaded else "Calibrated Visual Heuristic Engine"
    }

@app.post("/predict")
async def predict_potato_score(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    contents = await file.read()
    try:
        image = Image.open(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {e}")

    if model_loaded or load_clip_model():
        try:
            return analyze_with_clip(image)
        except Exception as e:
            logger.warning(f"CLIP processing error: {e}, falling back to heuristic")
            return analyze_with_heuristic(image)
    else:
        return analyze_with_heuristic(image)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
