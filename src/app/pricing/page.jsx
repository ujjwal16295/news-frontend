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
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth, firestore } from "../../service/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { initializePaddle } from "@paddle/paddle-js";
import { CheckCircle, XCircle } from "lucide-react";

const PricingPage = () => {
  const userId = useSelector(state => state.user)["userDetail"][0];
  const email = useSelector(state => state.user)["userDetail"][1];
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Enhanced plans with more detailed features and clearer distinctions
  const plans = [
    {
      name: "Basic",
      price: "$0",
      period: "Free forever",
      description: "Try our core features with limited usage",
      features: [
        { text: "3 News Summarizations", included: true },
        // { text: "Text Summary Output", included: true },
        { text: "Voice Generation", included: false, limit: "0" },
        { text: "PDF & Photo Upload", included: true },
        // { text: "Basic AI Summaries", included: true }
      ],
      type: "free",
      isPopular: false,
      buttonText: "Get Started"
    },
    {
      name: "Standard",
      price: "$10",
      period: "per month",
      description: "Perfect for regular news readers",
      features: [
        { text: "Unlimited News Summarizations", included: true },
        // { text: "Advanced AI Summaries", included: true },
        { text: "Voice Generation", included: false, limit: "0" },
        // { text: "Priority Processing", included: true },
        { text: "PDF & Photo Upload", included: true }
      ],
      priceId: "pri_01jmsp079tfmrya3q1qjwk74p9",
      type: "plan1",
      isPopular: true,
      buttonText: "Subscribe"
    },
    {
      name: "Premium",
      price: "$20",
      period: "per month",
      description: "Complete access to all features",
      features: [
        { text: "Unlimited News Summarizations", included: true },
        { text: "Unlimited Voice Generation", included: true },
        { text: "Premium Voice Quality", included: true },
        // { text: "Priority Processing", included: true },
        { text: "PDF & Photo Upload", included: true }
      ],
      priceId: "pri_01jmsp1rdbg66swshhwvsk93sx",
      type: "plan2",
      isPopular: false,
      buttonText: "Subscribe"
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

  const [paddle, setPaddle] = useState();
  useEffect(() => {
    initializePaddle({
      environment: "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      eventCallback: function(data) {
        if (data.name == "checkout.completed") {
          console.log(data);
        }
      }
    }).then((paddle) => setPaddle(paddle));
  }, []);

  const handleSubscribe = async (priceId, planType) => {
    if (!userId) {
      toast.error("Please login to subscribe to a plan");
      router.push("/login");
      return;
    }
    
    if (planType === "free") {
      return;
    }
    
    if (!paddle) {
      toast.error("Payment gateway has not been initialized");
      return;
    }

    try {
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
        customData: {
          userIdFirebase: userId,
          planType: planType
        }
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout process. Please try again.");
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-cyan-400 text-xl">Loading subscription details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 flex flex-col items-center">
      <h1 className="heading-large text-center mb-4">Choose Your <span className="text-cyan-400">Plan</span></h1>
      <p className="text-body text-center text-gray-400 max-w-2xl mb-12">
        Select the perfect plan for your news consumption needs. Upgrade anytime as your requirements grow.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col bg-gray-900 border ${
              plan.isPopular ? "border-cyan-400" : "border-gray-700"
            } transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 relative`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-cyan-500 text-black text-sm font-bold py-1 px-4 rounded-full">
                  Recommended
                </span>
              </div>
            )}
            <CardHeader className="text-center pb-2">
              <h2 className="heading-medium mb-1">{plan.name}</h2>
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-display font-bold text-cyan-400">{plan.price}</span>
                <span className="text-gray-400 ml-1">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-400">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex-grow pt-4">
              <ul className="space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <CheckCircle className="w-5 h-5 mr-2 text-cyan-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? "text-gray-200" : "text-gray-500"}>
                      {feature.text}
                      {feature.limit && <span className="block text-sm text-gray-500 ml-7 mt-1">Limit: {feature.limit}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                className={`w-full py-6 font-display text-base rounded-lg transition-all duration-300 ${
                  plan.type === userData?.service
                    ? "bg-cyan-400 text-black hover:bg-cyan-500"
                    : plan.isPopular
                    ? "bg-cyan-400 text-black hover:bg-cyan-500"
                    : "bg-gray-800 border border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-cyan-400"
                }`}
                onClick={() => handleSubscribe(plan.priceId, plan.type)}
              >
                {plan.type === userData?.service ? "Current Plan" : plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Feature Comparison Table for Mobile */}
      <div className="md:hidden w-full max-w-6xl mt-12">
        <h3 className="heading-small text-center mb-6">Compare Features</h3>
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-4">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="py-3 font-medium">News Summarizations</td>
                <td className="py-3 text-center">3</td>
                <td className="py-3 text-center text-cyan-400">∞</td>
                <td className="py-3 text-center text-cyan-400">∞</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="py-3 font-medium">Voice Generation</td>
                <td className="py-3 text-center">0</td>
                <td className="py-3 text-center">0</td>
                <td className="py-3 text-center text-cyan-400">∞</td>
              </tr>
              <tr>
                <td className="py-3 font-medium">Price</td>
                <td className="py-3 text-center">Free</td>
                <td className="py-3 text-center">$10/mo</td>
                <td className="py-3 text-center">$20/mo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* No Refund Policy Section */}
      <div className="w-full max-w-6xl mt-20">
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-8">
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