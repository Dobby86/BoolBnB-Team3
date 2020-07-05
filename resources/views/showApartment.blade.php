@extends('layouts.mainLayout')

@section('content')

@if (session("success"))
  <p>{{session("success")}}</p>
@endif
<div class="apartment">
  <div class="photo">
    <img src="{{$apartment['image']}}" alt="photo{{$apartment['id']}}">
  </div>

  <div class="info">
    <h1>{{$apartment['title']}}</h1>
    <div class="description">
      <h2>Descrizione</h2>
      <p>{{$apartment['description']}}</p>
    </div>

    <div class="other_info">
      <div class="features">
        <h2>Caratteristiche</h2>
        <ul>
          <li><b>Numero stanze: </b>{{$apartment['rooms_n']}}</li>
          <li><b>Numero letti: </b>{{$apartment['beds_n']}}</li>
          <li><b>Numero bagni: </b>{{$apartment['bathrooms_n']}}</li>
          <li><b>Metri quadrati: </b>{{$apartment['square_meters']}} metri2</li>
        </ul>
      </div>
      <div class="services">
        <h2>Servizi</h2>
        <ul>
          @foreach ($apartment -> services as $service)
            <li>{{$service -> name}}</li>
          @endforeach
        </ul>
      </div>
    </div>

    <div class="user_interactions">
      <div class="map">
        <div style="border: 1px solid black; width: 300px; height: 200px;" class="tomtom">
          questa è la mappa
        </div>
      </div>
      <div class="contact">
        {{$emailUtente = NULL}}
        @auth
          @php
            $emailUtente = auth()->user()-> email
          @endphp

        @endauth
        <form class="" action="{{route('storeMessage', $apartment -> id)}}" method="post">
          @csrf
          @method('POST')
          <label for="email">Inserisci la tua mail per essere ricontattato</label> <br>
          <input type="email" name="email" value="{{old('email', $emailUtente)}}"> <br>

          <label for="message">Inserisci ciò che vuoi chiedere al proprietario</label> <br>
          <input type="textarea" name="message" value="{{old('message')}}"> <br>
          <button type="submit" name="submit">Invia Messaggio</button> <br>
        </form>
      </div>
    </div>


  </div>
  @auth
    @if (auth()->user()-> id == $apartment -> user_id)
      <a href="{{route('editApartment', $apartment['id'])}}">
        <button type="button" name="button">Modifica</button>
      </a>
      <a style="margin-left:50px" href="{{route('deleteApartment', $apartment['id'])}}">
        <button type="button" name="button">Cancella</button>
      </a>

    @endif
  @endauth
</div>

@endsection