import { useEffect, useState, useMemo } from 'react';
import styles from './ProfileContainer.module.css';
import { Link, Navigate, useParams } from 'react-router-dom';

import { updateUser } from '../../services/apiService';
import { toast } from 'react-toastify';
const ProfileContainer = ({
  user,
  setIsProfile,
  profileContainerPosition,
  profileContainerTop,
  profileContainerLeft,
  updateProfileBorder,
}) => {
  const profileContainerStyle = useMemo(() => {
    return {
      position: profileContainerPosition,
      top: profileContainerTop,
      left: profileContainerLeft,
    };
  }, [profileContainerPosition, profileContainerTop, profileContainerLeft]);

  const updateProfileStyle = useMemo(() => {
    return {
      border: updateProfileBorder,
    };
  }, [updateProfileBorder]);
  const navigate = Navigate();

  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const [updateData, setUpdateData] = useState();
  console.log({ updateData: updateData });

  const [isUpdate, setIsUpdate] = useState(false);

  const submitHandler = async () => {
    setPicLoading(true);

    const userData = {
      name: user?.name,
      email: user?.email,
      photo: pic,
    };

    try {
      const data = await updateUser(userData);

      if (data) {
        console.log({ userData: data });
        setUpdateData(data);
        localStorage.setItem('user', JSON.stringify(data));
        setPicLoading(false);
        setIsUpdate(false);
      }
    } catch (error) {
      toast.error('Registration failed');
      // setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast.error('Please Select an Image!');
      return;
    }
    console.log(pics);
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'kxxtmdn1');
      data.append('cloud_name', 'datkh2oxv');
      fetch('https://api.cloudinary.com/v1_1/datkh2oxv/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast.error('Please Select an Image!');
      setPicLoading(false);
      return;
    }
  };

  return (
    <div className={styles.profileContainer} style={profileContainerStyle}>
      <div className={styles.profileInfoCard}>
        <div className={styles.maxwell}>{user.name}</div>
        <div className={styles.maxwellgmailcom}>{user.email}</div>
        <div className={styles.profilePhoto}>
          <img
            className={styles.profilePhotoChild}
            src={user.photo}
            alt={user.name}
          />
        </div>
        <div
          className={`cursor-pointer ${styles.closeProfile}`}
          onClick={() => setIsProfile(false)}
        >
          <div className={styles.close}>Close</div>
        </div>
        <div
          className={`cursor-pointer ${styles.updateProfile}`}
          style={updateProfileStyle}
          onClick={() => setIsUpdate(true)}
        >
          <div className={styles.update}>Update</div>
        </div>
      </div>
      {isUpdate ? (
        <div className="flex fex-row justify-between items-center">
          <div className={`mt-3 flex flex-col gap-2`}>
            <label>Upload your Picture</label>
            <input
              type="file"
              // className="flex p-1"
              // className={styles.upload}
              accept="image/*"
              onChange={(e) => postDetails(e.target.files[0])}
            />
            <button
              className={`text-white bg-red-600 px-2 py-1 mt-3`}
              onClick={submitHandler}
            >
              Update
            </button>
          </div>
          <div className={`mt-3 flex flex-col gap-2`}>
            <button
              className={`text-white bg-red-600 px-2 py-1 mt-3`}
              onClick={() => navigate('/otp')}
            >
              Change Password
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileContainer;
