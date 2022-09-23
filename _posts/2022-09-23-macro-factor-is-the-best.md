---
layout: post
title:  MacroFactor - Data Driven and Mentally Freeing
date:   2022-09-23 01:00:00
description: A newer and better way to track TDEE
categories: ramblings
---

If there’s one thing about me anyone knows, it’s that I’m frugal to the point of being __slightly_ off-putting_.

Appetizers, non-essential fashion, random gadgets, and items that everyone deems as “must-have” completely pass me by.

Apps (applications, like the kind on your phone) are by-and-far the easiest for me to pass. 

Why would I buy an app to do something I can do myself, figure out how to do myself, or maybe I just don’t need to use?

That being said; I’ve been a fitness and health and diet junkie for as long as I can remember.
I’m that guy who has had 3+ year streaks on MyFitnessPal. You don’t want to compete against me in a Close-your-rings challenge with the Apple Watch. I have notebooks and spreadsheets and Evernotes laden with years of workouts, progression plans, and aspirations.

I’ve always been increasingly skeptical of pay-for-service fitness apps because the typical use-case is preying on peoples’ insecurities in exchange for a promise of faster, better, and to be honest… lackluster results.

---
Enter [Stronger By Science](https://www.strongerbyscience.com/)
---

Greg Nuckols and Eric Trexler (two guest co-hosts on a globally distributed, audience captivating, strength science [podcast](https://www.strongerbyscience.com/podcast/)) were also similarly frustrated with the fitness app landscape. 

Instead of abstaining from participating in the ecosystem, they decided to craft a potent team and deliver to market the most superior diet-assistance application.

Of course, I was equally hesitant about falling for the same old song-and-dance. However, one year after the launch of [MacroFactor](https://www.strongerbyscience.com/macrofactor/), and after listening to **>>** 200 podcasts from them, I decided to purchase and evaluate the new-fangled hubbaboloo.

---

Being someone in the machine learning and data science field, I can’t help but be overly scrupulous with what goes into the backend of some basic apps. Greg and Eric are smart guys, and they are equally as scrupulous. As a result, they have delivered something that is scientifically sound, dynamic, and user-friendly in the truest sense. 

One of the simplest sounding, and easiest to compute improperly metrics is one’s total daily energy expenditure (TDEE). 

On many online calculators, you can get a range of estimates by parametrizing your age, weight, sex, body-composition, and activity level estimates. You’ll quickly discover that these estimates vary wildly from (for example) 1,750 to 2,500 calories per day required for weight maintenance. Of course, that range is unwieldly large and can create confusion about how much and of what to consume for optimal body-composition results.

MacroFactor does something novel and data-driven about this and I’m obsessed.

Unlike other apps, it doesn’t add in estimates for all your steps, entered workouts, and other estimated expenditures because there is simply too much variance to account for between individuals. To complicate the picture further, non-exercise activity thermogenesis (NEAT), basically how much fidgeting and wiggling and non-planned output you perform can range from 200 – 1,000 calories per day.

To resolve these many variances, MacroFactor **_appears_** to use some exponential smoothing and attempts to evaluate your estimated TDEE based on accurate energy consumption and your daily weigh-in trends.

---
For those who are interested... here's the formulas and initial value parameters.
---


\begin{eqnarray}
S_t & = & \alpha y_t + (1 - \alpha)(S_{t-1} + b_{t-1}) & & 0 \le \alpha \le 1 \\
\end{eqnarray}

\begin{eqnarray}
b_t & = & \gamma(S_t - S_{t-1}) + (1 - \gamma) b_{t-1} & & 0 \le \gamma \le 1 
\end{eqnarray}

\begin{eqnarray}
b_1 & = & \frac{1}{3} \left[ (y_2 - y_1) + (y_3 - y_2) + (y_4 - y_3) \right] \\
\end{eqnarray}

It’s beautiful. It’s dynamic. It tells the truth.

If the user is consistent (and honest) with energy consumption and weighing daily under identical circumstances, it appears to be the best true estimate of expenditure I’ve ever observed.

As your weight trend and eating patterns are established, the smoothing formula can be initialized, and the fun begins.

If your weight being trending up, say, 0.5 pounds per week, and you’re eating “at” your supposed maintenance calories required. The TDEE estimation dynamically adjusts to fit the supposition that you (the user) are actually in a daily 250 calorie surplus. This means that your TDEE is actually 250 calories LOWER than what you initially suspected. The beauty is, now you can take action, lower your calories, and adjust without making radical changes abruptly.

Well, one might say, that sounds really basic and doesn’t require anything other than pencil, paper, and a calculator if you can’t do basic math in your head. Why would someone pay for this?

Because it’s **COOL** and it’s **PRETTY**

Let’s think of another practical scenario.

You’re targeting weight maintenance, and you’ve been holding steady, but one night you decide to have most of a bottle of soy sauce (please don’t do this). Because of physiological necessity to balance your blood-ion and intracellular ratios, you retain significantly more water. 

As a result, your weight increases 5 pounds overnight.
This is the beauty in using some exponential smoothing method. There is a time-weighted decay factor that “remembers” and “forgets” recent and forgone events (fluctuations in weight). The app won’t see a 5-pound overnight gain and assume you were in a 17,500 (5 * 3,500) calorie surplus and gained that much body tissue. Most likely, your weight will adjust down to baseline over the course of two days as your body sheds the excess water and you return to baseline. The smoothing model captures the trend; as a result, your TDEE estimate remains on track for the maintenance calories you’ve been consuming.

---
What does all this mean and why does it matter?
---

Mental health; it’s all about mental health

For those who have been through periods of restriction, body recomposition, or intentional weight gain, it is a WILD rollercoaster. Unless you have the diligence and a Spock-like demeanor, emotions happen, and you overreact.

These overreactions can be: days of sever-restriction to compensate for your soy sauce mistake, binging on too many donuts to accelerate your weight-gain endeavor, or simply being unsure about what to do on a daily basis.

MacroFactor attempts to not penalize the user harshly through wild compensations in calories or berating you for being over your target for the day. As stated in the beginning, it is a diet assistance. If you’ve ever seen Matilda, MacroFactor is Ms. Honey and (every other app) is the Trunchbull. 

As someone who’s been a lifelong skeptic, I’ve given it a shot and I think you should likely try it too. It’s been relieving and comforting. Nonetheless, you’re in the good hands of two guest cohosts to a globally distributed podcast.

