---
layout: post
title: Radar Target Tracking using Tensorflow
date: 2022-09-25 01:00:00
description: Training a Kalman Filter using Tensorflow P1
categories: ramblings
---

In many fields of study, state-space-systems are a powerful and tool used to better predict and understand dynamical systems.
Kalman, after whom the Kalman Filter is named, derived a steady-state solution for a Gaussian system.

This technique can additionally be applied to dynamic systems with:

- various observation types (RADAR, LIDAR, optical, etc.)
- underlying state transition models (ballistic, linear, turning, jerking)
- systems with known control input (rocket with maneuvers, externally applied forces)

One of the incumberances with effectively using a Kalman derived filter is the need to define:

- state transition matrix
- observation matrix
- process gain
- observation gain

These parameters dictate how confident one is in the underlying systems' dynamics as well as the sensors' noise characteristics.
I.E. how well does our sensor capture the state of the object we are observing?

## The Kalman Filter

The following steps are for the **_prediction_** portion of the filter

$$
{\begin{align*}
\mathbf{x}_{k+1}^{(P)} &= A \mathbf{x}_k + B {a_k}\\
P_{k+1}^{(P)} &= A P_k A^T + Q_k^{(r_s)}
\end{align*}}
$$

The current state at time $$k$$, is represented by $$\mathbf{X}_{k}$$

For our application, a 12-state Kalman filter for position, velocity, acceleration, and jerk of a 3-D body is

$$\mathbf{x} = [p_i \ p_j \ p_k \ v_i \ v_j \ v_k \ a_i \ a_j \ a_k \ j_i \ j_j \ j_k]$$

Additionally, the state-transition matrix, $$\mathbf{F_k}$$ is the following and is described from [THIS PAPER](https://www.researchgate.net/publication/3002819_A_jerk_model_to_tracking_highly_maneuvering_targets)

$$
\mathbf{F_k} = \begin{pmatrix}
 1&  \Delta T &\Delta T^2  &p_1  &0  &0  &0  &0  &0  &0  &0  &0 \\
 0&  1        & \Delta T   &q_1  &0  &0  &0  &0  &0  &0  &0  &0 \\
 0&  0        &  1         &r_1  &0  &0  &0  &0  &0  &0  &0  &0 \\
 0&  0        &  0         &s_1  &0  &0  &0  &0  &0  &0  &0  &0 \\
 0&  0        &  0         &0    &1  &\Delta T  &\Delta T^2  &p_1  &0  &0  &0  &0 \\
 0&  0        &  0         &0    &0  &1  &\Delta T  &q_1  &0  &0  &0  &0 \\
 0&  0        &  0         &0    &0  &0  &1  &r_1  &0  &0  &0  &0 \\
 0&  0        &  0         &0    &0  &0  &0  &s_1  &0  &0  &0  &0 \\
 0&  0        &  0         &0    &0  &0  &0  &0  &1  &\Delta T  &\Delta T^2  &p_1 \\
 0&  0        &  0         &0    &0  &0  &0  &0  &0  &1  &\Delta T  &q_1 \\
 0&  0        &  0         &0    &0  &0  &0  &0  &0  &0  &1  &r_1 \\
 0&  0        &  0         &0    &0  &0  &0  &0  &0  &0  &0  &s_1
\end{pmatrix}
$$

## Let's set up the frame of reference for a 3-Dimensional Position and Velocity Tracker

### Our sensor

We're going to be using a radar to track our ballistic object in this example

$$
z_{radar} =
\begin{pmatrix}
\rho  \\
\theta  \\
\phi
\end{pmatrix}
$$

$$\rho$$ and $$\theta$$ and $$\phi$$ are the spherical coordinate representatinos of: range, azimuth, and elevation (all relative to the sensor)

For this example, we'll also need to define our observation noise. That is, the noise in the measurement uncertainty for each component.

Let's let $$\sigma_{\rho} = 1$$ meters and $$\sigma_{\theta} = 0.0015$$ radians $$\sigma_{\phi} = 0.0015$$ radians

These terms are the diagonal of our _observation noise covariance_

$$
R_t =
\begin{pmatrix}
\sigma^2 &0  &0 \\
0 &  \theta^2 &0 \\
0 &  0 & \phi^2
\end{pmatrix}
$$

This is cool, but it introduces a problem to solve.

We are taking measurements os position only in range and angles, yet our system state $$\mathbf{X_k}$$ is in Earth Cenetered Earth Fixedd (ECEF) coordinates

We've got to address this by converting spherical coordinates to cartesian coordinates.

The basic transformation from spherical to Cartesian is:

$$
\begin{bmatrix}
x\\
y\\
z
\end{bmatrix} =

\begin{bmatrix}
\rho *cos \phi *cos \theta \\
\rho *cos \phi * sin \theta \\
\rho *sin \phi
\end{bmatrix}
$$

But this introduces predicaments, and those are the measurement uncertainties defined in $$\mathbf{R_t}$$

Long story short.. [A Robust Converted Measurement Kalman Filter for Target Tracking](https://hal.archives-ouvertes.fr/hal-01081009/document) derives a method to account for these uncertainties in the coordinate converstion.
GREAT! we're almost there.

Our resulting Python code to produce this conversion is below. The latex for this would have been a bit too intense for this post.

For reference.. R = range, A = azimuth, E = elevation (measurements from radar)

Rt is the observation covariance noise matrix, $$\mathbf{R_t}$$

        R2 = np.square(R)
        CE = np.cos(E)
        C2E = np.cos(2 * E)

        CA = np.cos(A)
        C2A = np.cos(2 * A)

        SE = np.sin(E)
        S2E = np.sin(2 * E)

        SA = np.sin(A)
        S2A = np.sin(2 * A)

        CA2, SA2, CE2, SE2 = map(np.square, [CA, SA, CE, SE])

        sr, sb, se = [np.sqrt(Rt[:, idx, idx, npna]) for idx in range(3)]

        sr2, se2, sb2 = map(np.square, [sr, se, sb])

        le = np.exp(-se2 / 2)
        lep = np.power(le, 4)
        lB = np.exp(-sb2 / 2)
        lBp = np.power(lB, 4)

        le2 = np.square(le)
        lB2 = np.square(lB)

        R2sr2 = R2 + sr2

        Rxx = -lB2 * le2 * R2 * CA2 * CE2 + 0.25 * R2sr2 * (1 + lBp * C2A) * (1 + lep * C2E)

        Ryy = -lB2 * le2 * R2 * SA2 * CE2 + 0.25 * R2sr2 * (1 - lBp * C2A) * (1 + lep * C2E)

        Rzz = -le2 * R2 * SE2 + 0.5 * (R2 + sr2) * (1 - lep * C2E)

        Rxy = -lB2 * le2 * R2 * SA * CA * CE2 + 0.25 * R2sr2 * lBp * S2A * (1 + lep * C2E)

        Rxz = -lB * le2 * R2 * CA * SE * CE + 0.5 * R2sr2 * lB * lep * CA * S2E

        Ryz = -lB * le2 * R2 * SA * SE * CE + 0.5 * R2sr2 * lB * lep * SA * S2E

        return npc([npc([Rxx[:, :, npna], Rxy[:, :, npna], Rxz[:, :, npna]], axis=2),
                    npc([Rxy[:, :, npna], Ryy[:, :, npna], Ryz[:, :, npna]], axis=2),
                    npc([Rxz[:, :, npna], Ryz[:, :, npna], Rzz[:, :, npna]], axis=2)],
                   axis=1)

'''

$$
\begin{align*}
 K_k &= P_k^{(P)} H^T{\left (H P_k^{(P)} H^T + Q_k^{(R_t)} \right)}^{-1}\\
{\mathbf{x}_k} &= (I - K_k H) \mathbf{x}_k^{(P)} + K_k {z_k}\\
{P_k} &= (I - K_k H) P_k^{(P)}
\end{align*}
$$

For optical tracking, we only have 2 Dimensional observations in aziumth and elevation, but no range information.
As a result, we are very certain of position in angular space, but have high uncertainty in range.

For RADAR tracking, we have excellent range information and noisy (er) azimuth and elevation measurements based on the sensors' pointing status.
As a result, we can be very confident in range and range-rate measurements, but are less confident in angular space.
