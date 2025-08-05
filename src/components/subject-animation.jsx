import React from "react";
import Lottie from "lottie-react";
const SubjectAnimation = ({ subject ,disable = false }) => {
  const animationDataMap = {
    math: require("../assets/lottie/math-animation.json"),
    chemistry: require("../assets/lottie/chemistry-animation.json"),
    physics: require("../assets/lottie/physics-animation.json"),
    computer: require("../assets/lottie/computer-animation.json"),
  };
  if (disable) {
    return null;
  }
  return (
    <>
     <Lottie
      animationData={animationDataMap[subject] || animationDataMap["math"]}
      loop={true}
      className="w-[20rem]"
    />
     <p className="text-base text-muted-foreground font-medium">
              Hi! I’m your{" "}
              <span className="text-primary font-bold capitalize">{subject} AI Assistant</span>{" "}
              — how can I help you today?
            </p>
    </>
   
  );
};

export default SubjectAnimation;
