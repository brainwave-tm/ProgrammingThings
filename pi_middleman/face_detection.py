from PIL import Image
import face_recognition
import numpy as np
import os
import re
import sys

def image_file_in_folder(folder):
    return [os.path.join(folder, f) for f in os.listdir(folder) if re.match(r'.*\.(jpg|jpeg|png)', f, flags=re.I)]

def main(unknown_image):
    print("Checking for faces")
    #Load this image into a numpy array using face rec library
    # TODO: pass in the image url
    image = face_recognition.load_image_file(unknown_image)
    
    # Find all the faces in the image using face rec library
    face_locations = face_recognition.face_locations(image, number_of_times_to_upsample=0, model="cnn")
    
    faces_detected = len(face_locations) > 0
    known_faces = False
    names_found = []
    coords = []
    # Only continue if faces have been found
    # We now need to check if any of the faces are recognised
    if faces_detected:
        print("{} faces found. Checking for authorised users.".format(len(face_locations)))
  
        known_face_encodings = []
        known_face_names = []
        
        for file in image_file_in_folder("known_images/"):
            basename = os.path.splitext(os.path.basename(file))[0]
            img = face_recognition.load_image_file(file)
            encodings = face_recognition.face_encodings(img)
            
            known_face_encodings.append(encodings[0])
            known_face_names.append(basename)
            
        face_encodings = face_recognition.face_encodings(image, face_locations)
    
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"
    
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)

            if matches[best_match_index]:
                name = known_face_names[best_match_index]
            
            print("{} found.".format(name))
            
            if name != "Unknown":
                known_faces = True
                
            names_found.append(name)
            
        for location_name in zip(face_locations, names_found):
            coords.append(location_name)
        
    else:
        print("No faces found")
        
    return faces_detected, known_faces, names_found, coords

if __name__ == "__main__":
    main(sys.argv[1])