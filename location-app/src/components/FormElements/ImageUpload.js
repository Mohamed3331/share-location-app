import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';


const ImageUpload = props => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = event => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;



// import React, { Component } from 'react';

// export class ImageUpload extends Component {
//   state={
//     profileImg:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
//   }

//   imageHandler = (e) => {
//     const reader = new FileReader();
//     reader.onload = () =>{
//       if(reader.readyState === 2){
//         this.setState({profileImg: reader.result})
//         console.log(this.state.profileImg);
//       }
//     }
//     reader.readAsDataURL(e.target.files[0])
//   };

// 	render() {
//     const { profileImg} = this.state
// 		return (
// 				<div className="container">
// 					<h1 className="heading">Add your Image</h1>
// 					<div className="img-holder">
// 						<img src={profileImg} alt="" id="img" className="img" style={{width: '50%'}}/>
// 					</div>
// 					{/* <input type="file" accept="image/*" name="image-upload" id="input" onChange={this.imageHandler} /> */}
//           <input
//             id={this.props.id}
//             type="file"
//             accept=".jpg,.png,.jpeg"
//             name="image-upload"
//             onChange={this.imageHandler}
//           />
// 					<div className="label">
//           <label className="image-upload" htmlFor="input">
// 						<i className="material-icons">add_photo_alternate</i>
// 						Choose your Photo
// 					</label>
//           </div>
// 				</div>
// 		);
// 	}
// }

// export default ImageUpload;
