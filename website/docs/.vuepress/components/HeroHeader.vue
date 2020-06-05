<template>
  <div class="container mx-auto h-screen">
    <div class="text-center px-3 lg:px-0">
      <h1 class="my-4 text-2xl md:text-3xl lg:text-5xl font-black leading-tight"> 
        Your whole project lifecycle in one software!
      </h1>
      <p class="leading-normal text-gray-800 text-base md:text-xl lg:text-2xl mb-8" > 
        If this is your process, <span class="font-black">gluon project</span> is for you:
      </p>
      <p class="leading-normal text-gray-800 text-base mb-8">
        <a class="right-arrow bg-secondary px-2 shadow-lg hover:underline text-white" href="#Lead">Lead</a>
        <a class="right-arrow ml-6 mb-2 px-2 shadow-lg hover:underline text-white" href="#Estimation">Estimation</a>
        <a class="right-arrow ml-6 mb-2 px-2 shadow-lg hover:underline text-white" href="#Offer">Offer</a>
        <a class="right-arrow ml-6 mb-2 px-2 shadow-lg hover:underline text-white" href="#Ressource">Ressource planning</a>
        <a class="right-arrow ml-6 mb-2 px-2 shadow-lg hover:underline text-white" href="#Task">Task management</a>
        <a class="right-arrow ml-6 mb-2 px-2 shadow-lg hover:underline text-white" href="#Time">Time tracking</a>
        <a class="right-arrow ml-6 mb-2 px-2 shadow-lg hover:underline text-white" href="#Project">Project monitoring</a>
        <a class="right-arrow ml-6 mb-2 px-2 shadow-lg hover:underline text-white" href="#Invoice">Invoice</a>
        <a class="right-arrow ml-6 mb-2 px-2 shadow-lg hover:underline text-white" href="#Post">Post calculation</a>
      </p>

      <div class="md:py-12">
        <p class="text-white mb-4">
          Built by a service company for service companies.<br>
          We are currently building gluon and implementing it in our own company.<br>
          Apply for news and early access:
        </p>
        <input type="email" placeholder="Your e-mail address" class="md:text-xl text-black w-64 -mr-2 py-2 pl-4 rounded-l-full outline-none shadow-lg">
        <button class="rounded-r-full bg-secondary hover:underline text-white md:text-xl text-bold py-2 pl-4 pr-6  shadow-lg">Apply</button>
        <p class="text-xs text-gray-800 mt-2">
          (We are a german software shop and underly GDPR. 
          So we certainly will not spam you and remove your address on request immediately.)
        </p>
      </div>
    </div>

    <div class="flex items-center w-full mx-auto content-end">
      <div class="h-48 md:h-auto flex flex-1 m-6 md:px-0 md:m-12 bg-white w-1/2 rounded shadow-xl" >
        <img class="object-cover" :src="$withBase(`/images/gluon-leads.png`)">
      </div> 
    </div>
  </div>
</template>