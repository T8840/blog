---
title: Rust的基本使用
author: T8840
date: '2023-07-01'
---

1.  安裝Rust：首先，您需要在您的計算機上安裝Rust編程語言。您可以訪問Rust官方網站（[https://www.rust-lang.org/）並按照相應的指南下載和安裝Rust。](https://www.rust-lang.org/%EF%BC%89%E4%B8%A6%E6%8C%89%E7%85%A7%E7%9B%B8%E6%87%89%E7%9A%84%E6%8C%87%E5%8D%97%E4%B8%8B%E8%BC%89%E5%92%8C%E5%AE%89%E8%A3%9DRust%E3%80%82)
    
2.  創建新項目：打開終端或命令提示符窗口，導航到您希望創建Rust項目的目錄。然後運行以下命令創建一個新的Rust項目：
    
    arduinoCopy code
    
    `$ cargo new <項目名稱>`
    
    替換 `<項目名稱>` 為您希望給項目命名的名稱。這將創建一個包含基本文件結構的新項目。
    
3.  進入項目目錄：運行以下命令進入您剛剛建立的項目目錄：
    
    shellCopy code
    
    `$ cd <項目名稱>`
    
    替換 `<項目名稱>` 為您剛剛建立的項目名稱。
    
4.  編輯代碼：使用您喜歡的代碼編輯器打開項目目錄中的主要代碼文件，即 `<項目名稱>/src/main.rs`。在這個文件中，您可以開始編寫Rust代碼。
    
5.  構建和運行項目：在項目目錄中運行以下命令來構建和運行您的Rust項目：
    
    rubyCopy code
    
    `$ cargo build`
    
    這將編譯項目並生成可執行文件。然後，運行以下命令來運行您的Rust項目：
    
    arduinoCopy code
    
    `$ cargo run`
    
    您的Rust項目將開始運行並輸出結果。
    
6.  進一步開發：開始編寫您的Rust代碼，添加功能，創建模塊等等。您可以使用Cargo來管理依賴庫和項目配置