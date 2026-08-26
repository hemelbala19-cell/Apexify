import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// আপনার ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyDsgQJgZ64-ARLqKa3vcdQpu_xVupD90W4",
  authDomain: "apexify-72bc2.firebaseapp.com",
  projectId: "apexify-72bc2",
  storageBucket: "apexify-72bc2.firebasestorage.app",
  messagingSenderId: "114061131405",
  appId: "1:114061131405:web:ffd00b701d70c164976cc4",
  measurementId: "G-RB6KW4S7JL"
};

// ইনিশিয়ালাইজ ফায়ারবেস
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UI এলিমেন্ট সিলেক্ট করা
const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");
const submitBtn = document.getElementById("submit-btn");
const switchText = document.getElementById("switch-text");
const switchBtn = document.getElementById("switch-btn");

let isSignUp = false;

// লগইন ও সাইনআপ মোড পরিবর্তন করার টগল
switchBtn.addEventListener("click", () => {
    isSignUp = !isSignUp;
    if (isSignUp) {
        formTitle.innerHTML = `Create Account on <span style="color: var(--brand-blue);">Apexify</span>`;
        formSubtitle.innerText = "Register to start your journey";
        submitBtn.innerText = "Sign Up";
        switchText.innerHTML = `Already have an account? <span id="switch-btn">Sign In</span>`;
    } else {
        formTitle.innerHTML = `Sign In to <span style="color: var(--brand-blue);">Apexify</span>`;
        formSubtitle.innerText = "Enter your details to access your dashboard";
        submitBtn.innerText = "Sign In";
        switchText.innerHTML = `Don't have an account? <span id="switch-btn">Sign Up</span>`;
    }
});

// ফর্ম সাবমিট হ্যান্ডলার (লগইন এবং রেজিস্ট্রেশন)
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        if (isSignUp) {
            // রেজিস্ট্রেশন লজিক
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ফায়ারস্টোরে ইউজারের প্রাথমিক ডেটা সংরক্ষণ (ধাপ ২ ও ৪ অনুযায়ী)
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: email,
                role: "user",
                accountStatus: "Inactive", // শুরুতে ইনঅ্যাক্টিভ থাকবে
                balance: 0,
                availableBalance: 0,
                createdAt: new Date().toISOString()
            });

            alert("সফলভাবে অ্যাকাউন্ট রেজিস্টার হয়েছে! এখন লগইন করুন।");
            isSignUp = false;
            location.reload();
        } else {
            // লগইন লজিক
            await signInWithEmailAndPassword(auth, email, password);
            alert("লগইন সফল হয়েছে!");
            // পরবর্তীতে এখানে ড্যাশবোর্ডে রিডাইরেক্ট করা হবে
        }
    } catch (error) {
        alert("ত্রুটি: " + error.message);
    }
});
