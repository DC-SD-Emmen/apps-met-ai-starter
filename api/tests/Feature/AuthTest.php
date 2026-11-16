<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_een_gebruiker_kan_registreren_en_krijgt_een_token(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Yara',
            'email' => 'yara@example.com',
            'password' => 'geheim1234',
        ])
            ->assertCreated()
            ->assertJsonStructure(['user' => ['id', 'name', 'email'], 'token'])
            ->assertJsonMissingPath('user.password');
    }

    public function test_inloggen_met_goed_wachtwoord_geeft_een_token(): void
    {
        User::factory()->create(['email' => 'bas@example.com', 'password' => 'geheim1234']);

        $this->postJson('/api/login', ['email' => 'bas@example.com', 'password' => 'geheim1234'])
            ->assertOk()
            ->assertJsonStructure(['token']);
    }

    public function test_inloggen_met_fout_wachtwoord_lukt_niet(): void
    {
        User::factory()->create(['email' => 'bas@example.com', 'password' => 'geheim1234']);

        $this->postJson('/api/login', ['email' => 'bas@example.com', 'password' => 'fout'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_me_werkt_alleen_met_token(): void
    {
        $this->getJson('/api/me')->assertUnauthorized();

        $token = User::factory()->create()->createToken('test')->plainTextToken;

        $this->withToken($token)->getJson('/api/me')->assertOk();
    }

    public function test_uitloggen_trekt_het_token_in(): void
    {
        $gebruiker = User::factory()->create();
        $token = $gebruiker->createToken('test')->plainTextToken;

        $this->withToken($token)->postJson('/api/logout')->assertOk();

        $this->assertCount(0, $gebruiker->tokens()->get());
    }
}
