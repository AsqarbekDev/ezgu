import React from "react";
import { Link } from "react-router-dom";

function PrivacyPolicyCard({
  strongHeader,
  header,
  text,
  liTexts,
  strongWords,
  linksText,
  linksTo,
}) {
  return (
    <div className="my-4">
      <p className="text-xl font-bold">{strongHeader}</p>
      <p className="text-lg font-bold">{header}</p>
      <p>{text}</p>
      {liTexts && (
        <ol style={{ listStyleType: "disc" }} className="ml-6">
          {liTexts.map((text, index) => (
            <li key={index} className="my-1">
              {strongWords && <strong>{strongWords[index]}</strong>} {text}{" "}
              {linksTo && (
                <Link to={linksTo[index]} className="underline text-blue-600">
                  {linksText ? linksText[index] : linksTo[index]}
                </Link>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default PrivacyPolicyCard;
