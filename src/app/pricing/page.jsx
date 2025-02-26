// "use client";
// import React, { useEffect, useState } from "react";
// import { Card, CardHeader, CardContent, CardFooter } from "../../components/ui/card";
// import { Button } from "../../components/ui/button";
// import { loadStripe } from "@stripe/stripe-js";
// import { auth, firestore } from "../../service/firebaseconfig";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// // Initialize Stripe
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// const PricingPage = () => {
//   const userId = useSelector(state => state.user)["userDetail"][0];
//   const email = useSelector(state => state.user)["userDetail"][1];
//   const router = useRouter()
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if(userId) {
//       // toast.loading("Loading your subscription details...");
      
//       const unsubscribe = onAuthStateChanged(auth, async (user) => {
//         try {
//           if (user) {
//             const userDocRef = doc(firestore, "users", user.uid);
//             const userSnap = await getDoc(userDocRef);
//             if (userSnap.exists()) {
//               setUserData(userSnap.data());
//               toast.dismiss();
//               toast.success("Subscription details loaded successfully");
//             } else {
//               toast.dismiss();
//               toast.error("Unable to load user details");
//             }
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           toast.dismiss();
//           toast.error("Failed to load subscription details");
//         } finally {
//           setLoading(false);
//         }
//       });
  
//       return () => unsubscribe();
//     } else {
//       setLoading(false);
//     }
//   }, [userId]);

//   const plans = [
//     {
//       name: "Free Plan",
//       price: "$0/month",
//       features: ["summarize news 3 times", "0 voice generation", "Limited usage"],
//       stripePriceId: "",
//       type: "free",
//     },
//     {
//       name: "Plan 1",
//       price: "$10/month",
//       features: ["summarize news unlimited times", "0 voice generation", "Increased usage limits"],
//       stripePriceId: "price_1QuB8bSJPCIYWVZqvRj0Wail",
//       type: "plan1",
//     },
//     {
//       name: "Plan 2",
//       price: "$20/month",
//       features: ["summarize news unlimited times", "unlimited voice generation", "Higher usage limits"],
//       stripePriceId: "price_1QuB94SJPCIYWVZqobh2qEY0",
//       type: "plan2",
//     }
//   ];

//   const handleSubscribe = async (stripePriceId, planType) => {
//     if (!userId) {
//       toast.error("Please login to subscribe to a plan", {
//         description: "You'll be redirected to the login page"
//       });
//       router.push("/login");
//       return;
//     }

//     try {
//       if (planType === "free") {
//         // toast.info("You're already on the free plan");
//         return;
//       }
     
//       if (planType === userData.service && userId) {
//         toast.info("You're already subscribed to this plan");
//         return;
//       }

//       // Show loading toast for subscription process
//       // toast.loading("Processing your subscription...");

//       const response = await fetch("http://localhost:4000/api/create-checkout-session", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           priceId: stripePriceId,
//           planType: planType,
//           userId: userId,
//           email: email
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         toast.dismiss();
//         if (response.status === 401) {
//           toast.error("Session expired. Please login again");
//           router.push("/login");
//         } else {
//           toast.error(errorData.error || "Failed to process subscription");
//         }
//         return;
//       }

//       const { sessionId } = await response.json();
//       toast.dismiss();
//       toast.success("Redirecting to secure payment page...");

//       // Redirect to Stripe Checkout
//       const stripe = await stripePromise;
//       const { error } = await stripe.redirectToCheckout({ sessionId });
      
//       if (error) {
//         toast.error(error.message || "Failed to redirect to payment page");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.dismiss();
//       if (error.message === "Failed to fetch") {
//         toast.error("Unable to connect to server. Please check your internet connection");
//       } else {
//         toast.error("Failed to process subscription. Please try again later");
//       }
//     }
//   };

"use client";
import React, {useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth, firestore } from "../../service/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { initializePaddle } from "@paddle/paddle-js";

const PricingPage = () => {
  const userId = useSelector(state => state.user)["userDetail"][0];
  const email = useSelector(state => state.user)["userDetail"][1];
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define your plans with correct Paddle price IDs
  const plans = [
    {
      name: "Free Plan",
      price: "$0/month",
      features: ["summarize news 3 times", "0 voice generation", "Limited usage"],
      type: "free",
    },
    {
      name: "Plan 1",
      price: "$10/month",
      features: ["summarize news unlimited times", "0 voice generation", "Increased usage limits"],
      priceId: "pri_01jmsp079tfmrya3q1qjwk74p9", // Replace with your actual Paddle price ID
      type: "plan1",
    },
    {
      name: "Plan 2",
      price: "$20/month",
      features: ["summarize news unlimited times", "unlimited voice generation", "Higher usage limits"],
      priceId: "pri_01jmsp1rdbg66swshhwvsk93sx", // Replace with your actual Paddle price ID
      type: "plan2",
    }
  ];

  useEffect(() => {
    // Load user data
    if(userId) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        try {
          if (user) {
            const userDocRef = doc(firestore, "users", user.uid);
            const userSnap = await getDoc(userDocRef);
            if (userSnap.exists()) {
              setUserData(userSnap.data());
              toast.success("Subscription details loaded successfully");
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load subscription details");
        } finally {
          setLoading(false);
        }
      });
  
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const[paddle,setPaddle]=useState()
  useEffect(()=>{
    initializePaddle({
      environment:"sandbox",
      token:process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      eventCallback: function(data) {
        if (data.name == "checkout.completed") {
          console.log(data);
        }
      }
    }).then((paddle)=>setPaddle(paddle))
  },[])



  const handleSubscribe = async (priceId, planType) => {
    if (!userId) {
      toast.error("Please login to subscribe to a plan");
      router.push("/login");
      return;
    }
    if(!paddle){
      toast.error("payment gateway has not been initialized")
      return 
    }

    try {
      if (planType === "free") return;
      
      if (planType === userData?.service) {
        toast.info("You're already subscribed to this plan");
        return;
      }

      // Create checkout with direct Paddle integration
      paddle.Checkout.open({
        items: [{ priceId: priceId, quantity: 1 }],
        settings: {
            displayMode: "overlay",
            theme: "dark",
            successUrl: "https://news-backend-motc.onrender.com/success",
        },
        customData:{
          userIdFirebase:userId,
          planType:planType
        },
        // eventCallback: function (data) {
        //     if (data.event === "checkout.failed") {
        //         console.error("Checkout failed:", data);
        //         toast.error("payment failed")
        //         window.location.href = `http://localhost:3000/pricing`;
        //     }else if (data.event === "checkout.completed") {
        //     console.log("data")
        //     console.log("Checkout ID:", data.checkout.id);
        //     window.location.href = `http://localhost:3000/success?checkout_id=${data.checkout.id}`;
        // }
        // }
    });
    

    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout process. Please try again.");
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-marker text-xl">Loading subscription details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 flex flex-col items-center">
      <h1 className="heading-large text-cyan-400 text-center mb-12">Choose Your Plan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex flex-col bg-gray-900 border border-gray-700 transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20">
            <CardHeader>
              <h2 className="heading-medium text-center">{plan.name}</h2>
              <p className="text-3xl font-display font-bold text-center text-cyan-400">{plan.price}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-4 text-body">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full font-display border border-gray-700 text-gray-300 rounded-lg transition-all duration-300 ${
                  plan.type === userData?.service
                    ? "border-cyan-400 text-cyan-400"
                    : "hover:border-cyan-400 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
                }`}
                onClick={() => handleSubscribe(plan.priceId, plan.type)}
              >
                {plan.type === userData?.service ? "Current Plan" : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* No Refund Policy Section */}
      <div className=" w-full max-w-6xl mt-20">
        <div className="">
          <h3 className="heading-small text-cyan-400 mb-4 text-center">No Refund Policy</h3>
          <p className="text-body text-gray-300 text-center">
            All purchases are final and non-refundable. By subscribing to any of our paid plans, you acknowledge and agree that we do not provide refunds for any subscription payments made. Please carefully consider your subscription choice before proceeding with payment.
          </p>
          <p className="text-body text-gray-300 mt-4 text-center">
            If you have any questions about our subscription plans or payment process, please contact our support team before making a purchase.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;