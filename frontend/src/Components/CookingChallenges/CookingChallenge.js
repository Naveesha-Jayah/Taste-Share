import React, { useState } from "react";
import axios from "axios";

function ChallengeForm() {
  const [challenge, setChallenge] = useState({
    challengeTitle: "",
    challengeDetails: "",
    startDate: "",
    endDate: "", // Fixed typo from 'endtDate' to 'endDate'
  });

  const [coverImg, setCoverImg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setChallenge({ ...challenge, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async () => {
    if (!coverImg) return "";

    const formData = new FormData();
    formData.append("file", coverImg);

    try {
      const res = await axios.post("http://localhost:8081/challenges/coverImg", formData);
      return res.data;
    } catch (err) {
      console.error("Image upload error:", err);
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const uploadedImageName = await handleImageUpload();
      const challengeData = {
        ...challenge,
        coverImg: uploadedImageName,
      };

      const response = await axios.post("http://localhost:8081/challenges", challengeData);
      alert("Challenge Created Successfully!");
      console.log(response.data);
      
      // Reset form after successful submission
      setChallenge({
        challengeTitle: "",
        challengeDetails: "",
        startDate: "",
        endDate: "",
      });
      setCoverImg(null);
    } catch (err) {
      console.error("Error creating challenge:", err);
      alert("Failed to create challenge. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create Cooking Challenge</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Challenge Title</label>
          <input
            type="text"
            name="challengeTitle"
            placeholder="e.g., '30-Minute Meals Challenge'"
            value={challenge.challengeTitle}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Challenge Details</label>
          <textarea
            name="challengeDetails"
            placeholder="Describe the challenge rules, requirements, and prizes..."
            value={challenge.challengeDetails}
            onChange={handleChange}
            style={styles.textarea}
            required
          />
        </div>

        <div style={styles.dateRow}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={challenge.startDate}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>End Date</label>
            <input
              type="date"
              name="endDate"
              value={challenge.endDate}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Cover Image</label>
          <div style={styles.fileInputContainer}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImg(e.target.files[0])}
              style={styles.fileInput}
              id="coverImg"
            />
            <label htmlFor="coverImg" style={styles.fileInputLabel}>
              {coverImg ? coverImg.name : "Choose an image..."}
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          style={isSubmitting ? {...styles.button, ...styles.buttonSubmitting} : styles.button}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Challenge"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    margin: "40px auto",
    padding: "30px",
    maxWidth: "700px",
    backgroundColor: "#fff9f2",
    border: "1px solid #f5e6d3",
    borderRadius: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    fontFamily: "'Poppins', sans-serif",
    backgroundImage: "linear-gradient(to bottom, #fff9f2, #fff4e8)"
  },
  heading: {
    textAlign: "center",
    color: "#e67e22",
    fontSize: "32px",
    marginBottom: "30px",
    fontWeight: "600",
    fontFamily: "'Playfair Display', serif",
    position: "relative",
    paddingBottom: "15px",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: "0",
      left: "50%",
      transform: "translateX(-50%)",
      width: "80px",
      height: "3px",
      backgroundColor: "#e67e22",
      borderRadius: "3px"
    }
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontSize: "15px",
    color: "#5a4a3a",
    fontWeight: "500",
    marginLeft: "5px"
  },
  input: {
    padding: "14px 16px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #f0d9c0",
    backgroundColor: "#fffdfa",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 1px 4px rgba(0,0,0,0.05)",
    fontFamily: "'Poppins', sans-serif",
    "&:focus": {
      outline: "none",
      borderColor: "#e67e22",
      boxShadow: "0 0 0 3px rgba(230, 126, 34, 0.2)"
    }
  },
  textarea: {
    padding: "14px 16px",
    height: "140px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #f0d9c0",
    backgroundColor: "#fffdfa",
    resize: "vertical",
    transition: "all 0.3s ease",
    fontFamily: "'Poppins', sans-serif",
    "&:focus": {
      outline: "none",
      borderColor: "#e67e22",
      boxShadow: "0 0 0 3px rgba(230, 126, 34, 0.2)"
    }
  },
  dateRow: {
    display: "flex",
    gap: "20px",
    "@media (max-width: 600px)": {
      flexDirection: "column",
      gap: "20px"
    }
  },
  fileInputContainer: {
    position: "relative",
    overflow: "hidden",
    display: "inline-block",
    width: "100%"
  },
  fileInput: {
    position: "absolute",
    left: "0",
    top: "0",
    opacity: "0",
    width: "100%",
    height: "100%",
    cursor: "pointer"
  },
  fileInputLabel: {
    padding: "14px 16px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #f0d9c0",
    backgroundColor: "#fffdfa",
    color: "#5a4a3a",
    display: "block",
    cursor: "pointer",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "&:hover": {
      borderColor: "#e67e22"
    }
  },
  button: {
    padding: "16px",
    marginTop: "10px",
    backgroundColor: "#e67e22",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 8px rgba(230, 126, 34, 0.3)",
    "&:hover": {
      backgroundColor: "#d35400",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 12px rgba(230, 126, 34, 0.4)"
    },
    "&:active": {
      transform: "translateY(0)"
    },
    "&:disabled": {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
      transform: "none"
    }
  },
  buttonSubmitting: {
    backgroundColor: "#e67e22",
    opacity: "0.8"
  }
};

export default ChallengeForm;