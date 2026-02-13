import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {} from "./Tw.css";
import { Link, useNavigate } from "react-router-dom";

const schema = Yup.object({
  phone: Yup.string()
    .matches(/^09\d{9}$/, "شماره همراه معتبر نیست")
    .required("وارد کردن شماره الزامی است"),
});

export default function Login() {
  const navigate = useNavigate();

  const fullText = "با خنده وارد شوید";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const renderText = () => {
    const highlight = "خنده";
    const startIndex = displayedText.indexOf(highlight);
    if (startIndex === -1) return displayedText;
    return (
      <>
        {displayedText.slice(0, startIndex)}
        <span className="text-red-500 font-bold">
          {displayedText.slice(startIndex, startIndex + highlight.length)}
        </span>
        {displayedText.slice(startIndex + highlight.length)}
      </>
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center  bg-cover bg-center md:px-20"
      style={{ backgroundImage: "url('/rzer.webp')" }}
    >
      <div className="w-[460px] bg-black/30 rounded-2xl p-10 text-white backdrop-blur">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <img src="/logo.webp" className="w-20 rounded-4xl" />
          </div>
        </div>

        <p className="text-center mb-6 text-white">{renderText()}</p>

        <Formik
          initialValues={{ phone: "" }}
          validationSchema={schema}
          onSubmit={(values) => {
            toast.success(`کد تایید به ${values.phone} ارسال شد`);

            navigate("/Code", {
              state: { phone: values.phone },
            });
          }}
        >
          {({ values, handleChange, errors, touched }) => {
            const isValid = values.phone.length === 11;

            return (
              <Form className="space-y-6">
                {/* phone input */}
                <div className="relative">
                  <div className="flex bg-white rounded-md overflow-hidden text-black">
                    <div className="px-2 flex items-center">
                      <img src="iran.webp" alt="" className="w-8" />
                    </div>
                    <div className="px-2 text-gray-500 flex items-center">
                      +98
                    </div>
                    <div className="w-px bg-gray-300 my-2"></div>
                    <input
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      placeholder="شماره همراه"
                      className="peer flex-1 p-3 outline-none text-right placeholder:text-right rounded-md"
                    />
                  </div>
                  {errors.phone && touched.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* submit button */}
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`w-full py-3 rounded-md transition-all duration-300 ${
                    isValid
                      ? "bg-red-500 text-white transition-all=.4s hover:bg-red-600"
                      : "bg-gray-400 text-gray-900 cursor-not-allowed"
                  }`}
                >
                  تایید و ادامه
                </button>

                <p className="text-center text-sm text-gray-300 mt-2">
                  عضو نیستید؟{" "}
                  <span
                    className="text-red-500 cursor-pointer"
                    onClick={() => navigate("/Register")}
                  >
                    عضو شوید
                  </span>
                </p>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
