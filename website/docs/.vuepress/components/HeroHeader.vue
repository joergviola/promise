<template>
  <div class="container mx-auto">
    <div class="text-center px-3 lg:px-0">
      <h1 class="my-4 text-2xl md:text-3xl lg:text-5xl font-black leading-tight"> 
        Your whole project lifecycle in one software!
      </h1>
      <p class="leading-normal text-gray-800 text-base md:text-xl lg:text-2xl mb-8" > 
        If this is your process, <span class="font-black">gluon project</span> is for you:
      </p>
      <p class="leading-normal text-gray-800 text-base mb-8">
        <process-arrow to="#Lead" title="Lead"></process-arrow>
        <process-arrow to="#Estimation" title="Estimation"></process-arrow>
        <process-arrow to="#Offer" title="Offer"></process-arrow>
        <process-arrow to="#Ressource" title="Ressource planning"></process-arrow>
        <process-arrow to="#Task" title="Task management"></process-arrow>
        <process-arrow to="#Time" title="Time tracking"></process-arrow>
        <process-arrow to="#Project" title="Project monitoring"></process-arrow>
        <process-arrow to="#Invoice" title="Invoice"></process-arrow>
        <process-arrow to="#Post" title="Post calculation"></process-arrow>
      </p>

      <div class="md:py-12">
        <p class="text-gray-800 mb-4">
          Built for project based service companies.<br>
          Apply for news and early access:
        </p>
        <input type="email" placeholder="Your e-mail address" class="md:text-xl text-black w-64 -mr-2 py-2 pl-4 rounded-l-full outline-none shadow-lg">
        <button class="rounded-r-full bg-secondary hover:underline text-white md:text-xl text-bold py-2 pl-4 pr-6  shadow-lg">Apply</button>
        <div class="text-xs text-gray-800 mt-2 mx-32">
          (We are from germany and underly GDPR. 
          So we certainly will not spam you and remove your address on request immediately.)
        </div>
      </div>
    </div>

    <div class="flex items-center w-full mx-auto content-end">
      <div class="flex flex-1 m-6 md:px-0 md:m-12 bg-white w-1/2 rounded shadow-xl" >
        <img class="object-cover" :src="$withBase(`/images/gluon-home.jpg`)">
      </div> 
    </div>
  </div>
</template>