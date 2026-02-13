import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";

export default function CodeVerify() {
  const location = useLocation();
  const phone = location.state?.phone;

  const fullText = "کد تایید را وارد کنید";
  const [displayedText, setDisplayedText] = useState("");
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef([]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const renderText = () => {
    const highlight = "تایید";
    const startIndex = displayedText.indexOf(highlight);
    if (startIndex === -1) return displayedText;

    return (
      <>
        {displayedText.slice(0, startIndex)}
        <span className="text-red-600 font-bold">
          {displayedText.slice(startIndex, startIndex + highlight.length)}
        </span>
        {displayedText.slice(startIndex + highlight.length)}
      </>
    );
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 4) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const isValid = code.every((c) => c !== "");

  const submitHandler = () => {
    if (!isValid) return;
    toast.success("ورود با موفقیت انجام شد");
  };

  const resendHandler = () => {
    setTimer(60);
    toast.info(`کد مجدداً به شماره ${phone} ارسال شد`);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center md:px-20"
      style={{ backgroundImage: "url('/rzer.webp')" }}
    >
      <div className="w-[460px] bg-black/30 rounded-2xl p-10 text-white backdrop-blur">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <img src="/logo.webp" className="w-30 rounded-4xl" />
          </div>
        </div>

        <p className="text-center mb-6 text-white">{renderText()}</p>

        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-gray-50">کد ارسال‌شده به {phone}</p>
          <Link to={"/Register"}>
            <span className="text-xs text-gray-300 cursor-pointer hover:text-red-500 hover:underline">
              ویرایش شماره
            </span>
          </Link>
        </div>

        <div className="flex justify-between gap-3 mb-8" dir="ltr">
          {code.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              className="w-14 h-14 text-center text-xl rounded-md bg-white border border-gray-300 text-black outline-none focus:ring-2 focus:ring-red-600"
            />
          ))}
        </div>

        <button
          onClick={submitHandler}
          disabled={!isValid}
          className={`group relative w-full py-3 rounded-md overflow-hidden transition-all duration-300 ${
            isValid
              ? "bg-red-500 text-white transition-all=.4s hover:bg-red-600"
              : "bg-gray-400 text-gray-900 cursor-not-allowed"
          }`}
        >
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            ←
          </span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
            تایید و ادامه
          </span>
        </button>

        <div className="text-center mt-6 text-sm">
          {timer > 0 ? (
            <span className="text-gray-300">ارسال مجدد تا {timer} ثانیه</span>
          ) : (
            <button
              onClick={resendHandler}
              className="text-red-500 hover:underline"
            >
              ارسال مجدد کد
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
