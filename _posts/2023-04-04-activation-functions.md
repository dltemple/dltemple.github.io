---
title: "Visualising Activation Functions in Neural Networks"
excerpt: "Using D3, this post visually explores activation functions, a fundamental component of neural networks."
layout: post
categories:
  - deep learning
tags:
  - machine learning
  - deep learning
  - activation function
author: "Dwight Temple"
date: "04 April 2023"
---

<div class="container">
  <div class="activation-functions">
    <div class="activation-function">
      <h2>Sigmoid</h2>
      <div id="sigmoid-plot" class="interactive-plot"></div>
      <div class="metadata">
        <p>
          The Sigmoid function maps input values to the range (0, 1). It's commonly used in binary classification tasks.
        </p>
      </div>
    </div>
    <div class="activation-function">
      <h2>ReLU</h2>
      <div id="relu-plot" class="interactive-plot"></div>
    </div>
    <div class="activation-function">
      <h2>Tanh</h2>
      <div id="tanh-plot" class="interactive-plot"></div>
    </div>
    <div class="activation-function">
      <h2>Leaky ReLU</h2>
      <div id="leaky-relu-plot" class="interactive-plot"></div>
    </div>
    <div class="activation-function">
      <h2>ELU</h2>
      <div id="elu-plot" class="interactive-plot"></div>
    </div>
    <div class="activation-function">
      <h2>Swish</h2>
      <div id="swish-plot" class="interactive-plot"></div>
    </div>
  </div>
</div>
