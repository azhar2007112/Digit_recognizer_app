
#chobi aklam json format flask api hisebe pathalam,,decode korlo abar ki seta predict korlam model theke,,json hisebe predition pathalam abar show holo
import base64
from flask import Flask, request, jsonify, render_template
from PIL import Image
from io import BytesIO
import numpy as np
import tensorflow as tf
from flask_cors import CORS


model = tf.keras.models.load_model('ekush.keras')
#flask application create korlam r cross allow kore request orgin dif
app = Flask(__name__)
CORS(app)

# render kori home page re url visit korle mane amr je canvus baalchal ache r ki
#The Flask object (app) serves the homepage using the route /.
@app.route('/')
def home():
    return render_template('index.html') 
@app.route('/recognize', methods=['POST'])
def recognize_digit():
    try:
        data = request.get_json()
        img_data = data['image']
        
       
        img_data = base64.b64decode(img_data.split(',')[1])
        img = Image.open(BytesIO(img_data)).convert('L')
        
       
        img = img.resize((28, 28))
        
        
        img_array = np.array(img) / 255.0
        img_array = img_array.reshape(1, 28, 28, 1) 
        
        predictions = model.predict(img_array)
        top_3_indices = predictions.argsort()[0][-3:][::-1]  #highest probability niye reverse order e sajalm
        

        top_3_scores = predictions[0][top_3_indices]
        
        # Return the top 3 predictions as a JSON response
        return jsonify({
            'top_3_predictions': [
                {'digit': int(top_3_indices[i]), 'score': float(top_3_scores[i])} for i in range(3)
            ]
        })

    except Exception as e:
      
        return jsonify({'error': str(e)}), 500
#hurrah run korlam ne debug mood e
if __name__ == '__main__':
    app.run(debug=True)
