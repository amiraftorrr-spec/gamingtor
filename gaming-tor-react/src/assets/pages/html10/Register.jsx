import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = Yup.object({
  phone: Yup.string().matches(/^09\d{9}$/).required(),
  name: Yup.string().required(),
});

export default function Register() {
  const navigate = useNavigate();

  const fullText = "به گیمینگ تور خوش آمدید";
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
    const highlight = "گیمینگ تور";
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

  return (
    <div
      className="min-h-screen flex items-center justify-center md:justify- bg-cover bg-center md:px-20 "
      style ={{ backgroundImage: "url('/rzer.png')" }}
    >
      <div className="w-[460px] bg-black/10 rounded-2xl p-10 text-white backdrop-blur">

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <img src="/logo.jpg" className="w-20 rounded-4xl" />
          </div>
        </div>

        <p className="text-center mb-6 text-white">{renderText()}</p>
        <p className="text-right text-sm mb-4 text-gray-50">ثبت نام</p>

        <Formik
          initialValues={{ phone: "", name: "" }}
          validationSchema={schema}
          onSubmit={(values) => {
            toast.success(
              `${values.name} عزیز، کد تایید برای شما ارسال شد`
            );

            navigate("/Code", {
              state: { phone: values.phone },
            });
          }}
        >
          {({ values, handleChange }) => {
            const isValid =
              values.phone.length === 11 && values.name.length > 0;

            return (
              <Form className="space-y-6">

                {/* phone */}
                <div className="relative">
                  <div className="flex bg-white rounded-md overflow-hidden text-black">
                    <div className="px-2 flex items-center">
                      <img src="iran.png" alt="" className="w-8" />
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
                  <span className="absolute bottom-0 left-0 h-1 w-0 bg-red-500 transition-all duration-500 ease-out peer-focus:w-full" />
                </div>

                {/* name */}
                <div className="relative">
                  <div className="bg-white rounded-md overflow-hidden">
                    <input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder="نام"
                      className="peer w-full p-3 outline-none text-black text-right placeholder:text-right rounded-md"
                    />
                  </div>
                  <span className="absolute bottom-0 left-0 h-1 w-0 bg-red-500 transition-all duration-500 ease-out peer-focus:w-full" />
                </div>

                {/* submit */}
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`group relative w-full py-3 rounded-md overflow-hidden transition-all duration-300  ${
                    isValid
                      ? "bg-red-500 text-white transition-all=.4s hover:bg-red-600"
                      : "bg-gray-400 text-gray-900 cursor-not-allowed"
                  }`}
                >
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 ">
                    ←
                  </span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2 ">
                    تایید و ادامه
                  </span>
                </button>

                {/* login */}
                <p className="text-center text-sm text-gray-300">
                  قبلاً عضو شده‌اید؟{" "}
                  <span
                    className="text-red-500 cursor-pointer"
                    onClick={() => navigate("/Login")}
                  >
                    وارد شوید
                  </span>
                </p>

                {/* divider */}
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-gray-400"></div>
                  <span className="px-3 text-sm text-gray-300">یا</span>
                  <div className="flex-1 h-px bg-gray-400"></div>
                </div>

                {/* google */}
                <button
                  type="button"
                  className="w-full border border-white rounded-md py-3 flex items-center justify-center gap-2"
                >
                  <img src="/google.png" className="w-5" />
                  <span className="bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 bg-clip-text text-transparent font-semibold">
                    ورود با گوگل
                  </span>
                </button>

              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
