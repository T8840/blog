(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{443:function(o,t,r){"use strict";r.r(t);var e=r(2),n=Object(e.a)({},(function(){var o=this,t=o._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":o.$parent.slotKey}},[t("h2",{attrs:{id:"为什么要用到goroutine池"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#为什么要用到goroutine池"}},[o._v("#")]),o._v(" 为什么要用到Goroutine池")]),o._v(" "),t("ul",[t("li",[o._v("Goroutine的开销虽然“廉价”，但也不是免费的。一旦规模化后，这种非零成本也会成为瓶颈。我们以一个Goroutine分配2KB执行栈为例，100w Goroutine就是2GB的内存消耗。")]),o._v(" "),t("li",[o._v("其次，Goroutine从Go 1.4版本开始采用了连续栈的方案，也就是每个Goroutine的执行栈都是一块连续内存，如果空间不足，运行时会分配一个更大的连续内存空间作为这个Goroutine的执行栈，将原栈内容拷贝到新分配的空间中来。\n连续栈的方案，虽然能避免Go 1.3采用的分段栈会导致的“hot split”问题，但连续栈的原理也决定了，一旦Goroutine的执行栈发生了grow，那么即便这个Goroutine不再需要那么大的栈空间，这个Goroutine的栈空间也不会被Shrink（收缩）了，这些空间可能处于长时间闲置的状态，直到Goroutine退出。")]),o._v(" "),t("li",[o._v("另外，随着Goroutine数量的增加，Go运行时进行Goroutine调度的处理器消耗，也会随之增加，成为阻碍Go应用性能提升的重要因素。")])]),o._v(" "),t("p",[o._v("那么面对这样的问题，常见的应对方式是什么呢？"),t("br"),o._v("\nGoroutine池就是一种常见的解决方案。这个方案的核心思想是对Goroutine的重用，也就是把M个计算任务调度到N个Goroutine上，而不是为每个计算任务分配一个独享的\nGoroutine，从而提高计算资源的利用率。")]),o._v(" "),t("h2",{attrs:{id:"实现一个简单的goroutine池"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#实现一个简单的goroutine池"}},[o._v("#")]),o._v(" 实现一个简单的Goroutine池")]),o._v(" "),t("h3",{attrs:{id:"实现原理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#实现原理"}},[o._v("#")]),o._v(" 实现原理")]),o._v(" "),t("p",[o._v("workerpool有很多种实现方式，这里为了更好地演示Go并发模型的应用模式，以及并\n发原语间的协作，我们采用完全基于channel+select的实现方案，不使用其他数据结构，也不使用sync包提供的各种同步结构，比如Mutex、RWMutex，以及Cond等。"),t("br"),o._v("\nworkerpool的实现主要分为三个部分：")]),o._v(" "),t("ul",[t("li",[o._v("pool的创建与销毁；")]),o._v(" "),t("li",[o._v("pool中worker（Goroutine）的管理；")]),o._v(" "),t("li",[o._v("task的提交与调度。\n其中，后两部分是pool的“精髓”所在，这两部分的原理如下图：")])]),o._v(" "),t("h3",{attrs:{id:"workerpool的一个最小可行实现"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#workerpool的一个最小可行实现"}},[o._v("#")]),o._v(" workerpool的一个最小可行实现")])])}),[],!1,null,null,null);t.default=n.exports}}]);