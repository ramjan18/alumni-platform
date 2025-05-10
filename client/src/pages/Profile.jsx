import { useState, useEffect } from "react";
import Navbar from "../template/Navbar";
import { BorderButton } from "../components/Buttons";
import { Detail } from "../components/ProfileDetail";
import Notification from "../components/Notification";
import Footer from "../template/Footer";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms/User";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  DialogTitle,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { Close, NotificationsNone } from "@mui/icons-material";
import { fetcherPost, fetcherPut } from "../utils/axiosAPI";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [data, setData] = useState(null);
  const user = useRecoilValue(userAtom);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userAtom);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const getUserProfileData = async (userID) => {
    setLoading(true);
    try {
      const url = "/user/get";
      const body = { userID: userID };
      const response = await fetcherPost(url, { body });
      setData(response);

      setEditData({
        position: response?.position || "",
        branch: response?.branch || "",
        batch: response?.batch || "",
        companyName: response?.companyName || "",
        email: response?.email || "",
        name: response?.name || "",
        profileImage: response?.profilePicURL || "",
        userID: user?.basic?.id,
      });
    } catch (error) {
      console.log("Error in getting user details: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.basic?.id) getUserProfileData(user.basic.id);
  }, [user]);

  const handleDetailChange = (title, value) => {
    setEditData((prevdata) => ({ ...prevdata, [title]: value }));
  };

  const handleEditFormOpen = () => {
    setEditOpen(true);
  };

  const handleEditFormClose = () => {
    setEditOpen(false);
    setSelectedFile(null);
    setPreview(null);
  };

  const handleSaveClick = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("position", editData.position);
      formData.append("companyName", editData.companyName);
      formData.append("email", editData.email);
      formData.append("batch", editData.batch);
      formData.append("branch", editData.branch);
      formData.append("userID", editData.userID);
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const token = localStorage.getItem("token");

      const result = await fetcherPut("/user/edit", {
        body: formData,
        token,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // const result = await res.json();

      if (result?.UpdatedUser) {
        toast.success("Profile Updated Successfully");
        setData(result.UpdatedUser);
        handleEditFormClose();
      }
    } catch (error) {
      console.log("Error in updating user details: ", error);
    }
    setSubmitting(false);
  };


  

  const handleLogout = () => {
    setUser({
      basic: {
        name: "",
        email: "",
        rank: -1,
        isLoggedIn: false,
      },
      profilePic: "",
      socials: {
        githubUrl: "",
        linkedInUrl: "",
        xUrl: "",
      },
      notifications: [],
      address: {
        city: "",
        state: "",
      },
      activity: {
        projectsFloated: 0,
        jobsFloated: 0,
        internshipsFloated: 0,
      },
      collegeDetails: {
        branch: "",
        batch: "",
      },
      jobRelated: {
        company: "",
        jobTitle: "",
      },
    });
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <p className=" text-primaryPink font-bold font-poppins text-3xl px-6 py-4 ">
          Loading...
        </p>
      ) : (
        <>
          <div className="relative">
            <div className="overflow-auto md:overflow-hidden h-auto md:h-[250px] lg:h-[350px] 2xl:h-[450px]">
              <img
                src="/pvpit4.jpg"
                alt="cover-img"
                
                className="w-full object-cover relative h-[600px] top-0 md:-top-[6em] -z-[1]"
              />
            </div>
            <Stack spacing={1} direction={"row"}>
              <div
                className="absolute bottom-0 right-28"
                onClick={handleEditFormOpen}
              >
                <BorderButton name={"Edit Profile"} />
              </div>
              <div className="absolute bottom-2 right-2">
                <Button
                  color={"secondary"}
                  variant={"contained"}
                  onClick={handleLogout}
                >
                  LogOut
                </Button>
              </div>
            </Stack>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="relative flex flex-col items-center md:w-[37%] lg:w-[30%] bg-[#d9d9d9]/40 gap-16 px-8">
              <div className="absolute -top-16 sm:-top-20 lg:-top-28 xl:-top-32 left-8 sm:left-auto overflow-hidden rounded-full size-32 sm:size-40 lg:size-52 xl:size-60 bg-gray-300 flex justify-center items-center">
                <img
                  src={data?.profilePicURL || "/blank-profile-picture.webp"}
                  alt="profile-img"
                  className="w-full object-cover"
                />
              </div>

              <div className="flex flex-col items-center gap-8 pt-28 md:pt-36">
                <div className="flex gap-1">
                  <img src="/location-icon.svg" alt="" />
                  <p className="text-base lg:text-xl font-poppins">
                    {data?.jobLocation}
                  </p>
                </div>
                <div className="flex justify-center gap-8 items-center w-full">
                  <a
                    href={
                      data?.githubURL ? data.githubURL : "https://github.com/"
                    }
                    target="blank"
                  >
                    <img
                      src="/github.svg"
                      alt="github-icon"
                      width="35px"
                      height="35px"
                    />
                  </a>
                  <a
                    href={data?.xURL ? data.xURL : "https://x.com/"}
                    target="blank"
                  >
                    <img
                      src="/twittor.svg"
                      alt="X-icon"
                      width="35px"
                      height="35px"
                    />
                  </a>
                  <a
                    href={
                      data?.linkedinURL
                        ? data.linkedinURL
                        : "https://linkedin.com/"
                    }
                    target="blank"
                  >
                    <img
                      src="/linkedin.svg"
                      alt="linkedin-icon"
                      width="35px"
                      height="35px"
                    />
                  </a>
                </div>
              </div>
              <div className="">{/* Projects floated section */}</div>
            </div>

            <div className="flex flex-col gap-14 px-8 pt-6 pb-40 bg-primaryBackground md:w-[63%] lg:w-[70%]">
              <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 lg:items-center">
                <p className="font-poppins text-3xl xl:text-4xl">
                  {data?.name}
                </p>
                {data?.rank === 1 && (
                  <div className="flex gap-3">
                    <div className="px-5 sm:px-7 py-2 bg-[#F5DEE7] border-2 border-[#FA005E] rounded-3xl text-xs sm:text-sm font-bold h-fit">
                      Alumni
                    </div>
                    <div className="px-5 sm:px-7 py-2 bg-[#D9EFD3] border-2 border-[#3ACC16] rounded-3xl text-xs sm:text-sm font-bold text-center h-fit">
                      Open for Mentorship
                    </div>
                  </div>
                )}
                {data?.rank === 2 && (
                  <div className="px-5 sm:px-7 py-2 bg-[#F5DEE7] border-2 border-[#FA005E] rounded-3xl text-xs sm:text-sm font-bold h-fit">
                    Student
                  </div>
                )}
              </div>

              {/* Details and notifications */}
              <div className="flex flex-col xl:flex-row gap-10 xl:gap-5 2xl:gap-14">
                <div className="flex flex-col gap-3">
                  <Detail type={"Position"} detail={data?.position} />
                  <Detail type={"Company"} detail={data?.companyName} />
                  <Detail type={"Email"} detail={data?.email} />
                  <Detail type={"Batch"} detail={data?.batch} />
                  <Detail type={"Branch"} detail={data?.branch} />
                </div>

                <div className="border border-solid border-black/20"></div>

                <div className="flex flex-col gap-6 h-[350px] px-3 pt-2 pb-5 overflow-y-auto w-fit">
                  <div className="flex flex-row gap-1">
                    <p className="font-poppins text-lg text-black/60">
                      Notifications
                    </p>
                    <NotificationsNone className="text-black/60" />
                  </div>
                  {data?.notifications?.map((item) => (
                    <Notification
                      key={item._id}
                      type={item.type}
                      text={item.name}
                      stdId={item.userID}
                      id={item.objID}
                      getUserProfileData={getUserProfileData}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />

      <Dialog
        open={editOpen}
        onClose={handleEditFormClose}
        fullWidth
        maxWidth={"md"}
      >
        <DialogTitle>
          <Stack
            direction="row"
            width={"100%"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h5">Edit Profile Details</Typography>
            <IconButton onClick={handleEditFormClose}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 3 }}
            width={"100%"}
            sx={{ paddingTop: "15px" }}
          >
            <Stack spacing={2} width={{ xs: "100%", md: "50%" }}>
              <TextField
                fullWidth
                label="Name"
                value={editData?.name}
                onChange={(e) => handleDetailChange("name", e.target.value)}
              />
              <TextField
                fullWidth
                label="Position"
                value={editData?.position}
                onChange={(e) => handleDetailChange("position", e.target.value)}
              />
              <TextField
                fullWidth
                label="Company"
                value={editData?.companyName}
                onChange={(e) =>
                  handleDetailChange("companyName", e.target.value)
                }
              />
            </Stack>
            <Stack spacing={2} width={{ xs: "100%", md: "50%" }}>
              <TextField
                fullWidth
                label="Email"
                value={editData?.email}
                onChange={(e) => handleDetailChange("email", e.target.value)}
              />
              <TextField
                fullWidth
                label="Batch"
                value={editData?.batch}
                onChange={(e) => handleDetailChange("batch", e.target.value)}
              />
              <TextField
                fullWidth
                label="Branch"
                value={editData?.branch}
                onChange={(e) => handleDetailChange("branch", e.target.value)}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginBottom: "10px",
                  }}
                />
              )}
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button
                fullWidth
                variant="contained"
                style={{
                  backgroundColor: "#FA005E",
                  color: "white",
                  height: "50px",
                  fontWeight: 500,
                  fontSize: "1em",
                }}
                disabled={submitting}
                onClick={handleSaveClick}
              >
                SAVE
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
