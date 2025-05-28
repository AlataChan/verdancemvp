'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="w-full bg-white backdrop-blur-md bg-white/90 shadow-sm py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-xl font-medium text-primary-600">蔚澜智越</div>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/login" className="px-4 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 rounded-full border border-primary-200 hover:bg-primary-50 transition-colors">
              登录
            </Link>
            <Link href="/register" className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-full shadow-sm hover:shadow transition-all">
              注册
            </Link>
          </div>
        </div>
      </nav>

      {/* 英雄区域 */}
      <section className="w-full bg-gradient-to-br from-primary-500 to-primary-700 text-white py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl font-semibold mb-3">蔚澜智越ESG积分与任务平台</h1>
            <p className="text-base opacity-90 mb-6">
              企业可持续发展解决方案，助力企业实现ESG目标，推动绿色低碳转型。
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/register')}
                className="bg-white text-primary-600 hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all"
              >
                开始使用
              </button>
              <button
                onClick={() => router.push('/about')}
                className="border border-white/30 text-white hover:bg-white/10 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                了解更多
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md h-56 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
              <p className="text-base font-medium">ESG可视化图表展示区</p>
            </div>
          </div>
        </div>
      </section>

      {/* 特性介绍 */}
      <section className="w-full py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-10">平台特性</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-base font-medium mb-2">ESG任务管理</h3>
              <p className="text-sm text-gray-600">
                创建、分配和跟踪ESG相关任务，确保企业可持续发展目标有序推进。
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-base font-medium mb-2">积分激励系统</h3>
              <p className="text-sm text-gray-600">
                完成任务获取积分，激励员工参与ESG活动，提高企业整体可持续表现。
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="h-10 w-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-base font-medium mb-2">数据分析与报告</h3>
              <p className="text-sm text-gray-600">
                全面的ESG数据分析与可视化，帮助企业了解可持续发展进展和改进空间。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 使用流程 */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center mb-10">使用流程</h2>
          <div className="flex flex-col md:flex-row justify-between items-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center mb-8 md:mb-0">
              <div className="h-12 w-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4 text-base font-medium shadow-sm">
                1
              </div>
              <h3 className="text-base font-medium mb-1">注册账号</h3>
              <p className="text-sm text-gray-600 text-center max-w-xs">
                创建您的企业账号并设置基本信息
              </p>
            </div>
            <div className="flex flex-col items-center mb-8 md:mb-0">
              <div className="h-12 w-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4 text-base font-medium shadow-sm">
                2
              </div>
              <h3 className="text-base font-medium mb-1">参与任务</h3>
              <p className="text-sm text-gray-600 text-center max-w-xs">
                浏览并参与可用的ESG任务
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4 text-base font-medium shadow-sm">
                3
              </div>
              <h3 className="text-base font-medium mb-1">获取积分</h3>
              <p className="text-sm text-gray-600 text-center max-w-xs">
                完成任务获取积分并查看排行榜
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="w-full bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-base font-medium mb-3">蔚澜智越</h3>
              <p className="max-w-xs text-sm text-gray-400">企业ESG可持续发展的智能伙伴，助力绿色低碳转型。</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-300">产品</h4>
                <ul className="space-y-1.5">
                  <li><Link href="/features" className="text-sm text-gray-400 hover:text-white">功能</Link></li>
                  <li><Link href="/pricing" className="text-sm text-gray-400 hover:text-white">价格</Link></li>
                  <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white">常见问题</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-300">关于</h4>
                <ul className="space-y-1.5">
                  <li><Link href="/about" className="text-sm text-gray-400 hover:text-white">关于我们</Link></li>
                  <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white">联系我们</Link></li>
                  <li><Link href="/blog" className="text-sm text-gray-400 hover:text-white">博客</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-300">法律</h4>
                <ul className="space-y-1.5">
                  <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white">服务条款</Link></li>
                  <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-white">隐私政策</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center md:text-left md:flex md:justify-between">
            <p className="text-sm text-gray-400">© 2023 蔚澜智越. 保留所有权利.</p>
            <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">微信</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.502 19.525c1.524-1.105 2.498-2.738 2.498-4.554 0-3.326-3.237-6.023-7.229-6.023s-7.229 2.697-7.229 6.023c0 3.327 3.237 6.024 7.229 6.024.825 0 1.621-.117 2.36-.332l.212-.032c.139 0 .265.043.384.111l1.716.858c.096.049.191.074.286.074.096 0 .189-.026.274-.075.188-.107.304-.3.304-.516l-.003-.154-.033-.236-.044-.262c-.054-.31-.361-2.116-.361-2.116-.001-.13.05-.252.141-.341v.001zm-8.258-4.025c-.592 0-1.071-.479-1.071-1.071s.479-1.071 1.071-1.071 1.071.479 1.071 1.071-.479 1.071-1.071 1.071zm4.017 0c-.592 0-1.071-.479-1.071-1.071s.479-1.071 1.071-1.071 1.071.479 1.071 1.071-.479 1.071-1.071 1.071z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">微博</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10.098 20c-4.176 0-7.742-2.048-7.742-4.576 0-1.323 1.015-2.851 2.731-3.875 0 0 .053-.034.144-.099.333-.225.721-.472 1.132-.69 1.069-.554 2.419-1.048 3.807-1.306.686-.128 1.194-.418 1.439-.752.126-.169.179-.334.179-.5s-.048-.318-.11-.377c-.057-.063-.175-.144-.394-.252l-.187-.096c-.416-.202-.839-.429-1.157-.685-.285-.224-.571-.479-.571-.96 0-.37.286-.697.737-.94-.248-.043-.481-.097-.696-.152-.762-.207-1.281-.485-1.545-.831-.131-.175-.197-.35-.197-.525 0-.317.228-.576.558-.667l.053-.013c-.533-.499-.883-1.018-.883-1.519 0-.2.065-.367.181-.52.315-.409.913-.663 1.683-.72.678-.051 1.333-.085 2.079-.066-.044-.343-.095-.745-.095-1.164 0-1.62 1.322-3.081 2.962-3.081 1.054 0 1.954.599 2.531 1.461.156-.067.401-.17.718-.296.654-.272 1.498-.55 2.293-.667.471-.067.831.362.732.802-.089.398-.91 2.007-1.659 2.819.801-.153 1.434-.363 1.434-.363.478-.122.857.348.631.813-.11.233-.962 1.735-2.173 2.499.003.054.004.108.004.163 0 2.249-1.668 5.705-4.703 7.346-.842.453-2.079 1.066-3.614 1.119-2.417.083-4.777-.871-4.777-2.496 0-.984 1.025-2.113 2.674-2.113 1.67 0 3.258.58 3.258 1.724 0 .412-.32.786-.826 1.097-.349.215-.737.349-1.156.402.662.08 1.493.08 2.414-.195 1.912-.565 3.034-1.901 3.034-2.409 0-.279-.24-.634-.709-.812l-.95.055c-1.079.625-2.727 1.11-4.568 1.11z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 